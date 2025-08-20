# backend/embedding_service/mysql_search_sql.py
import os
import re
import pymysql
from flask import Blueprint, request, jsonify

bp = Blueprint("mysql_sql", __name__)

ALLOWED_COLUMNS = {
    "marca","modelo","version","anio","tipo_carroceria","tipo_combustible","transmision",
    "sistema_traccion","admision","configuracion_cilindrada","potencia","torque","consumo",
    "autonomia_estimada","pantalla_resolucion","apple_carplay","android_auto",
    "asientos_electricos","asientos_electricos_detalle","tapiz","control_crucero",
    "sistema_sonido","pais_fabricacion","latin_ncap","capacidad_deposito_combustible",
    "capacidad_maletero","capacidad_carga","capacidad_remolque","peso_vacio","largo",
    "ancho","alto","altura_libre_suelo","distancia_entre_ejes","kilometros","imagen_url","id"
}
ALLOWED_COLUMNS_RE = r"(?:{})".format("|".join(sorted(ALLOWED_COLUMNS)))

FORBIDDEN = re.compile(
    r";|--|/\*|\*/|\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|GRANT|REVOKE|TRUNCATE|DESCRIBE|SHOW)\b",
    re.IGNORECASE
)

def auto_quote_literals(s: str) -> str:
    """
    Cita literales no numéricos no citados en comparaciones simples (=) y listas IN(..).
    """
    # = valor
    def repl_eq(m):
        col, val = m.group(1), m.group(2).strip()
        if re.fullmatch(r"\d+(\.\d+)?", val) or val.upper() in {"TRUE","FALSE","NULL"}:
            return f"{col} = {val}"
        if val.startswith("'") and val.endswith("'"):
            return f"{col} = {val}"
        return f"{col} = '{val}'"
    s = re.sub(rf"\b({ALLOWED_COLUMNS_RE})\b\s*=\s*([A-Za-z][A-Za-z0-9_ -]*)", repl_eq, s, flags=re.IGNORECASE)

    # IN (a, b, 'c')
    def repl_in(m):
        col, raw_list = m.group(1), m.group(2)
        items = [x.strip() for x in raw_list.split(",") if x.strip()]
        norm = []
        for it in items:
            if re.fullmatch(r"\d+(\.\d+)?", it) or it.upper() in {"TRUE","FALSE","NULL"} or (it.startswith("'") and it.endswith("'")):
                norm.append(it)
            else:
                norm.append(f"'{it}'")
        return f"{col} IN ({', '.join(norm)})"
    s = re.sub(rf"\b({ALLOWED_COLUMNS_RE})\b\s+IN\s*\(([^)]+)\)", repl_in, s, flags=re.IGNORECASE)
    return s

def sanitize_where(where: str) -> str:
    """
    Valida WHERE. Auto-cita literales y bloquea tokens peligrosos.
    """
    if not where:
        return ""
    s = where.strip()
    if not s.upper().startswith("WHERE "):
        raise ValueError("sql_where_mysql debe comenzar con 'WHERE '")
    if FORBIDDEN.search(s):
        raise ValueError("Tokens no permitidos en WHERE")

    # normaliza comillas antes de validar identificadores
    s = auto_quote_literals(s)

    # Identificadores: sólo columnas whitelisteadas y palabras clave
    identifiers = re.findall(r"\b[a-zA-Z_][a-zA-Z0-9_]*\b", s)
    allowed_keywords = {
        "WHERE","AND","OR","IN","BETWEEN","TRUE","FALSE","NULL","NOT","IS","LIKE"
    }
    for ident in identifiers:
        up = ident.upper()
        if up in allowed_keywords:  # palabra clave
            continue
        if ident.lower() in ALLOWED_COLUMNS:  # columna permitida
            continue
        # números no aparecen aquí porque regexp captura sólo alpha-start
        raise ValueError(f"Identificador no permitido: {ident}")

    return s

def get_conn():
    return pymysql.connect(
        host=os.getenv("MYSQL_HOST","127.0.0.1"),
        port=int(os.getenv("MYSQL_PORT","3306")),
        user=os.getenv("MYSQL_USER","aicar"),
        password=os.getenv("MYSQL_PASSWORD","aicarpwd"),
        database=os.getenv("MYSQL_DB","aicar"),
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True,
    )

# ---- Fallback: construir WHERE seguro desde filters (opcional) ----
def build_where_from_filters(filters: dict):
    clauses, params = [], []
    def add_in(col, arr):
        arr = [str(x).lower() for x in arr if x is not None]
        if not arr: return
        placeholders = ", ".join(["%s"]*len(arr))
        clauses.append(f"{col} IN ({placeholders})")
        params.extend(arr)

    if not isinstance(filters, dict):
        return "", []

    for key in ("marca","modelo","tipo_combustible","transmision","tipo_carroceria","pais_fabricacion","sistema_traccion"):
        val = filters.get(key)
        if isinstance(val, list):
            add_in(key, val)
        elif isinstance(val, str):
            add_in(key, [val])

    if "anio" in filters and isinstance(filters["anio"], dict):
        rng = filters["anio"]
        if "min" in rng and "max" in rng:
            clauses.append("anio BETWEEN %s AND %s"); params.extend([rng["min"], rng["max"]])
        elif "min" in rng:
            clauses.append("anio >= %s"); params.append(rng["min"])
        elif "max" in rng:
            clauses.append("anio <= %s"); params.append(rng["max"])

    if not clauses:
        return "", []
    return "WHERE " + " AND ".join(clauses), params

@bp.post("/search_sql")
def search_sql():
    body = request.get_json(force=True) or {}
    where = body.get("where", "") or ""
    limit = min(int(body.get("limit", 6)), 50)
    offset = max(int(body.get("offset", 0)), 0)
    filters = body.get("filters") or None

    where_clause, params = "", []
    try:
        if where:
            where_clause = sanitize_where(where)
    except ValueError as e:
        if filters:
            where_clause, params = build_where_from_filters(filters)
        else:
            return jsonify({"error": str(e), "where_received": where}), 400

    if not where_clause and filters:
        where_clause, params = build_where_from_filters(filters)

    sql = f"SELECT * FROM autos {where_clause} ORDER BY anio DESC, marca ASC LIMIT %s OFFSET %s"
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute(sql, (*params, limit, offset))
        rows = cur.fetchall()

    return jsonify({"items": rows, "count": len(rows), "where_used": where_clause})