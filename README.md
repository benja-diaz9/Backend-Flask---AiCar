# AiCar — Full‑stack demo (Assistant + MySQL + React)

AiCar is a small full‑stack demo that wires a conversational assistant to a MySQL catalog of cars.  
The assistant interprets user messages into **normalized filters** and a **MySQL `WHERE`** clause.  
The frontend shows the assistant’s `ui_text` in a chat bubble, renders `meta.next_questions` as suggested quick replies, and queries `POST /search_sql` with the returned `sql_where_mysql` to refresh the right‑hand results grid.

---

## 1) Features

- **Assistant** (OpenAI Assistants API) that outputs a **single JSON** object:
  - `ui_text`: friendly Spanish response + CTA
  - `filters`: normalized filters (snake_case)
  - `sql_where_mysql`: optional WHERE for MySQL
  - `meta.next_questions`: suggested follow-ups
- **MySQL table** `autos` with many attributes + `imagen_url`.
- **Secure SQL endpoint** `/search_sql` that validates `WHERE` before querying.
- **React/Vite frontend**:
  - Left: chat (user + assistant bubble; suggested questions aligned below assistant bubble)
  - Right: top 6 results grid with cross‑fade on update (shows fewer if <6, and empty state when 0)
  - Developer badge showing current backend URL
  - A small debug line shows the last `WHERE` used
- **CORS** allows `http://localhost:3000`/`127.0.0.1:3000`.

---

## 2) Repo layout (key files)

```
Backend-Flask---AiCar/
├─ backend/
│  ├─ __init__.py
│  ├─ embedding_service/
│  │  ├─ __init__.py
│  │  ├─ main.py                  # Flask app (start/chat/save + blueprint)
│  │  ├─ functions.py             # assistant creation/modes/context helpers
│  │  ├─ aux.py                   # misc helpers
│  │  └─ mysql_search_sql.py      # /search_sql (sanitized WHERE)
│  └─ .venv/                      # local virtualenv (ignored in git)
├─ front/
│  ├─ src/
│  │  ├─ App.tsx                  # chat UI + results pane (uses /search_sql)
│  │  └─ styles.css               # layout & animations
│  └─ .gitignore                  # ignores build artifacts & env
└─ README.txt (this file)
```

---

## 3) Requirements

- macOS/Linux/Windows
- **Python 3.10+** (virtualenv recommended)
- **Node 18+** and **pnpm** (or npm/yarn)
- **MySQL 8.0+**
- An **OpenAI API key**

---

## 4) Setup — Backend

1) Create and activate a virtualenv (from repo root):
```bash
cd backend
python -m venv .venv
source .venv/bin/activate         # on macOS/Linux
# .venv\Scripts\activate          # on Windows PowerShell
pip install -r embedding_service/requirements.txt
```

2) Environment variables: create **`backend/.env`**:
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
# Optional regional endpoint; falls back to a sample value already set in code
# OPENAI_API_BASE=https://api.openai.saopaulo.example.com/v1

# MySQL connection (defaults shown)
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=aicar
MYSQL_PASSWORD=aicarpwd
MYSQL_DB=aicar
```

3) Run Flask **(from repo root)**:
```bash
# set app path and run with reload
export FLASK_APP=backend.embedding_service.main
python -m flask --app backend.embedding_service.main run --host=127.0.0.1 --port=5000 --reload
```
You should see:
```
La versión de OpenAI es compatible.
Conexión exitosa a MongoDB
create_mode: False, use_mode: True
 * Running on http://127.0.0.1:5000
```

> Endpoints exposed by backend:
>
> - `GET /start` → `{ "thread_id": "<id>" }`
> - `POST /chat` body: `{ "thread_id": "<id>", "message": "texto" }`
>   - returns `{ "response": "<assistant JSON or text>" }`
> - `POST /search_sql` body: `{ "where": "WHERE ...", "limit": 6 }`
>   - returns `{ "items": [...], "count": n }`


---

## 5) Setup — MySQL

### 5.1 Install & run (Homebrew on macOS)
```bash
brew install mysql@8.0
brew services start mysql@8.0
# Optional: secure installation
mysql_secure_installation
```

If `mysql` isn’t in PATH:
```bash
echo 'export PATH="/opt/homebrew/opt/mysql@8.0/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 5.2 Create DB, user, table
Connect as root:
```bash
mysql -u root
```

Then run:
```sql
CREATE DATABASE IF NOT EXISTS aicar CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE USER IF NOT EXISTS 'aicar'@'localhost' IDENTIFIED BY 'aicarpwd';
GRANT ALL PRIVILEGES ON aicar.* TO 'aicar'@'localhost';
FLUSH PRIVILEGES;

USE aicar;

-- Table: autos (with imagen_url)
CREATE TABLE autos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

  marca                      VARCHAR(64)   NOT NULL,
  modelo                     VARCHAR(128)  NOT NULL,
  version                    VARCHAR(128)  NULL,
  anio                       INT           NOT NULL,

  tipo_carroceria            VARCHAR(64)   NULL,
  tipo_combustible           VARCHAR(32)   NULL,
  transmision                VARCHAR(32)   NULL,
  sistema_traccion           VARCHAR(16)   NULL,

  admision                   VARCHAR(32)   NULL,
  configuracion_cilindrada   VARCHAR(32)   NULL,
  potencia                   INT           NULL,
  torque                     INT           NULL,

  consumo                    DECIMAL(5,2)  NULL,    -- km/l
  autonomia_estimada         INT           NULL,    -- km
  pantalla_resolucion        VARCHAR(32)   NULL,

  apple_carplay              BOOLEAN       NULL,
  android_auto               BOOLEAN       NULL,
  asientos_electricos        BOOLEAN       NULL,
  asientos_electricos_detalle VARCHAR(16)  NULL,    -- 'Conductor' | 'Pasajero' | 'Ambos'
  tapiz                      VARCHAR(64)   NULL,
  control_crucero            VARCHAR(32)   NULL,
  sistema_sonido             VARCHAR(64)   NULL,

  pais_fabricacion           VARCHAR(64)   NULL,
  latin_ncap                 TINYINT       NULL,

  capacidad_deposito_combustible DECIMAL(6,1) NULL,
  capacidad_maletero         INT           NULL,
  capacidad_carga            INT           NULL,
  capacidad_remolque         INT           NULL,
  peso_vacio                 INT           NULL,

  largo                      DECIMAL(7,1)  NULL,    -- mm
  ancho                      DECIMAL(7,1)  NULL,    -- mm
  alto                       DECIMAL(7,1)  NULL,    -- mm
  altura_libre_suelo         DECIMAL(6,1)  NULL,    -- mm
  distancia_entre_ejes       DECIMAL(7,1)  NULL,    -- mm
  kilometros                 INT           NULL,    -- km

  imagen_url                 VARCHAR(512)  NULL,
  CONSTRAINT chk_imagen_url CHECK (imagen_url IS NULL OR imagen_url LIKE 'http://%' OR imagen_url LIKE 'https://%'),

  INDEX idx_marca_modelo_anio (marca, modelo, anio),
  INDEX idx_combustible_trans (tipo_combustible, transmision)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### 5.3 Seed data (examples)

> ⚠️ Prefer **direct image URLs** (not Google redirectors) so images load in the UI.

**BMW Z4 (2024)**:
```sql
INSERT INTO autos (
  marca, modelo, version, anio, tipo_carroceria, tipo_combustible, transmision,
  sistema_traccion, admision, configuracion_cilindrada, potencia, torque, consumo,
  autonomia_estimada, pantalla_resolucion, apple_carplay, android_auto,
  asientos_electricos, asientos_electricos_detalle, tapiz, control_crucero,
  sistema_sonido, pais_fabricacion, latin_ncap, capacidad_deposito_combustible,
  capacidad_maletero, capacidad_carga, capacidad_remolque, peso_vacio,
  largo, ancho, alto, altura_libre_suelo, distancia_entre_ejes, kilometros,
  imagen_url
) VALUES (
  'BMW','Z4','sDrive30i',2024,'Convertible','Gasolina','Automática',
  'RWD','Turbo','I4',255,400,7.40,
  NULL,'1080p',TRUE,TRUE,
  TRUE,'Ambos','Cuero','Adaptativo',
  'Harman Kardon','Alemania',NULL,52.0,
  281,NULL,NULL,1535,
  4324.0,1864.0,1304.0,130.0,2470.0,NULL,
  'https://cache.bmwusa.com/cosyasset/cosyfit/bmwna/cosy/ghostUnlimited_0/BCVsxjMB4fdEJEg1a0q2bDWZzHPBT6/cosy-1.png'
);
```

**BMW M2 (2024)**:
```sql
INSERT INTO autos (
  marca, modelo, version, anio, tipo_carroceria, tipo_combustible, transmision,
  sistema_traccion, admision, configuracion_cilindrada, potencia, torque, consumo,
  autonomia_estimada, pantalla_resolucion, apple_carplay, android_auto,
  asientos_electricos, asientos_electricos_detalle, tapiz, control_crucero,
  sistema_sonido, pais_fabricacion, latin_ncap, capacidad_deposito_combustible,
  capacidad_maletero, capacidad_carga, capacidad_remolque, peso_vacio,
  largo, ancho, alto, altura_libre_suelo, distancia_entre_ejes, kilometros,
  imagen_url
) VALUES (
  'BMW','M2','M',2024,'Coupe','Gasolina','Automática',
  'RWD','Turbo','I6',460,550,10.2,
  NULL,'1080p',TRUE,TRUE,
  TRUE,'Ambos','Cuero','Adaptativo',
  'Harman Kardon','Alemania',NULL,52,
  390,NULL,NULL,1725,
  4575,1854,1403,NULL,2747,0,
  'https://mediapool.bmwgroup.com/cache/P9/202210/P90480223/P90480223-the-new-bmw-m2-10-2022-2240px.jpg'
);
```

**BMW X1 xDrive28i (2023)**:
```sql
INSERT INTO autos (
  marca, modelo, version, anio, tipo_carroceria, tipo_combustible, transmision,
  sistema_traccion, admision, configuracion_cilindrada, potencia, torque, consumo,
  autonomia_estimada, pantalla_resolucion, apple_carplay, android_auto,
  asientos_electricos, asientos_electricos_detalle, tapiz, control_crucero,
  sistema_sonido, pais_fabricacion, latin_ncap, capacidad_deposito_combustible,
  capacidad_maletero, capacidad_carga, capacidad_remolque, peso_vacio,
  largo, ancho, alto, altura_libre_suelo, distancia_entre_ejes, kilometros,
  imagen_url
) VALUES (
  'BMW','X1','xDrive28i',2023,'SUV','Gasolina','Automática',
  'AWD','Turbo','I4',245,400,7.2,
  NULL,'1080p',TRUE,TRUE,
  TRUE,'Ambos','Cuero','Adaptativo',
  'Harman Kardon','Alemania',5,50.0,
  505,560,2000,1650,
  4500.0,1822.0,1598.0,205.0,2692.0,0,
  'https://mediapool.bmwgroup.com/cache/P9/202206/P90467401/P90467401-the-all-new-bmw-x1-xdrive30e-06-2022-2240px.jpg'
);
```

---

## 6) Setup — Frontend

1) Install deps and run dev server:
```bash
cd front
pnpm install            # or: npm install / yarn
pnpm dev                # Vite dev server on http://localhost:3000
```

2) Configure backend URL (Vite env):
Create **`front/.env.local`**:
```env
VITE_BACKEND_URL=http://127.0.0.1:5000
```

3) Behavior:
- On first message, the app calls `GET /start` and switches from landing to chat+results layout.
- Each user message:
  1. `POST /chat` → assistant returns a single JSON (we parse `ui_text`, `meta.next_questions`, and `sql_where_mysql`)
  2. If `sql_where_mysql` is present, the app calls `POST /search_sql` to refresh cards.
- Cards show `imagen_url` (if it’s a direct image), title (`marca modelo versión`), subtitle (year • body • transmission • fuel • consumption), and key tags.

---

## 7) Assistant output contract (front expects)

Assistant must return **only** a JSON object like:
```json
{
  "ui_text": "Soy AiCar, tu asistente de búsqueda de autos... ¿Quieres ajustar transmisión o combustible?",
  "filters": { "marca": ["bmw"], "anio": { "min": 2020 } },
  "sql_where_mysql": "WHERE marca IN ('BMW') AND anio >= 2020",
  "meta": {
    "normalization_applied": true,
    "assumptions": ["Economico=<=8.000.000 CLP"],
    "issues": [],
    "next_questions": [
      "¿Prefieres transmisión automática o manual?",
      "¿Deseas limitar el kilometraje?"
    ]
  }
}
```

---

## 8) Troubleshooting

- **/search_sql 500 – cryptography required**  
  Install `cryptography`: `pip install cryptography` (already in requirements).
- **No images render**  
  Use **direct** `https://...jpg|png|webp` links (avoid Google redirectors).
- **CORS errors**  
  Front must be on `http://localhost:3000` or `http://127.0.0.1:3000`. Backend CORS is configured for these origins.
- **Assistant returns plain text**  
  The frontend tries to extract JSON from code fences. Ensure prompt enforces “respuesta ÚNICA en JSON”.

---

## 9) Example manual SQL tests

```sql
-- All BMWs:
SELECT * FROM autos WHERE marca = 'BMW' ORDER BY anio DESC LIMIT 6;

-- BMW >= 2020, automatic:
SELECT * FROM autos
WHERE marca = 'BMW' AND anio >= 2020 AND transmision = 'Automática'
ORDER BY anio DESC LIMIT 6;
```

---

## 10) License

MIT (c) You. Use freely for demos and prototypes.
