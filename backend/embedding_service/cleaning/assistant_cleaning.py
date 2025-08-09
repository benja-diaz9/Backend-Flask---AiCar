import openai
import os
# Configura tu clave de API
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Listar todos los archivos
assistants = openai.beta.assistants.list()

# Eliminar asistentes por ID
for assistant in assistants:
    print(f"Borrando asistente: {assistant.id}")
    openai.beta.assistants.delete(assistant.id)

print("Todos los asistentes han sido eliminados.")
