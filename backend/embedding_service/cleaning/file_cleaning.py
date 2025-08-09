import openai
import os
# Configura tu clave de API
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Listar todos los archivos
files = openai.files.list()

# Eliminar archivos por ID
for file in files:
    print(f"Borrando archivo: {file.id}")
    openai.files.delete(file.id)

print("Todos los archivos han sido eliminados.")
