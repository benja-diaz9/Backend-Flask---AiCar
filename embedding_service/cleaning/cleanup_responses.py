import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

# Configuración de MongoDB
MONGO_URI = "mongodb://172.17.0.1:27019/"
DATABASE_NAME = "responses"
COLLECTION_NAME = "responses_TCO"

def connect_mongo(uri):
    try:
        client = MongoClient(uri)
        # Verificar la conexión
        client.admin.command('ping')
        print("Conexión exitosa a MongoDB")
        return client
    except ConnectionFailure as e:
        print(f"Error al conectar a MongoDB: {e}")
        exit(1)

def delete_all_documents(collection):
    confirmation = input("¿Estás seguro de que deseas eliminar TODOS los documentos de 'responses_TCO'? (sí/no): ")
    if confirmation.lower() != 'sí' and confirmation.lower() != 'si':
        print("Operación cancelada.")
        return
    
    result = collection.delete_many({})
    print(f"Se eliminaron {result.deleted_count} documentos de la colección '{COLLECTION_NAME}'.")

def main():
    client = connect_mongo(MONGO_URI)
    db = client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]
    
    delete_all_documents(collection)

    # Cerrar la conexión
    client.close()

if __name__ == "__main__":
    main()
