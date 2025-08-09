import openai
import os
# Configura tu clave de API
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Listar todos los archivos
vectorstores = openai.beta.vector_stores.list()

# Eliminar archivos por ID
for vector in vectorstores:
    print(f"Borrando vector store: {vector.id}")
    openai.beta.vector_stores.delete(vector.id)

print("Todos los vector stores han sido eliminados.")
