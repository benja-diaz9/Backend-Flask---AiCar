# Usa Python 3.10 como imagen base
FROM python:3.10-slim

# Crea un directorio de trabajo
WORKDIR /app

# Copiamos el requirements.txt primero para aprovechar la caché de Docker
COPY requirements.txt /app/

# Instalamos las dependencias con pip
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto de los archivos del proyecto (main.py, functions.py, etc.)
COPY . /app

# Exponer el puerto 8080 (usado por tu Flask)
EXPOSE 8080

# Variable de entorno para la API key de OpenAI (se asigna en tiempo de ejecución)
ENV OPENAI_API_KEY=""

# Comando por defecto que lanza Flask en el contenedor
CMD ["python", "main.py"]
