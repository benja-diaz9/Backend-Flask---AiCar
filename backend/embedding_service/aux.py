# update_config.py

import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from bson import ObjectId

def get_boolean_input(prompt):
    """
    Solicita al usuario una entrada y la valida como booleano.
    Solo acepta 'true' o 'false' (case-insensitive).
    """
    while True:
        user_input = input(prompt).strip().lower()
        if user_input in ['true', 't', 'yes', 'y', '1']:
            return True
        elif user_input in ['false', 'f', 'no', 'n', '0']:
            return False
        else:
            print("Entrada inválida. Por favor, ingresa 'true' o 'false'.")

def get_assistant_id(prompt):
    """
    Solicita al usuario que ingrese un assistant_id.
    Valida que la entrada no esté vacía.
    """
    while True:
        assistant_id = input(prompt).strip()
        if assistant_id:
            return assistant_id
        else:
            print("El assistant_id no puede estar vacío. Por favor, ingresa un ID válido.")

def main():
    # ID del documento a actualizar
    DOCUMENT_ID = "677fdbac6b2e14e787567a2b"

    print("=== Actualización de Configuración de Asistente GPT ===\n")

    # Solicitar y validar entradas del usuario
    create_mode = get_boolean_input("Ingresa el valor para 'create_mode' (true/false): ")
    use_mode = get_boolean_input("Ingresa el valor para 'use_mode' (true/false): ")
    base_id = input("Ingresa el valor para 'base_id': ")
    
    # Configuración de conexión a MongoDB
    MONGO_URI = "mongodb://localhost:27019/"  # Asegúrate de que este URI es correcto
    DATABASE_NAME = "assistant_config"
    COLLECTION_NAME = "config"

    try:
        # Conectar al cliente de MongoDB
        client = MongoClient(MONGO_URI)

        # Verificar la conexión
        client.admin.command('ping')
        print("\nConexión exitosa a MongoDB.")

    except ConnectionFailure as e:
        print(f"\nError al conectar a MongoDB: {e}")
        sys.exit(1)

    # Acceder a la base de datos y colección
    db = client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]

    try:
        # Convertir el DOCUMENT_ID a ObjectId
        object_id = ObjectId(DOCUMENT_ID)
    except Exception as e:
        print(f"\nError: El DOCUMENT_ID proporcionado no es válido: {e}")
        sys.exit(1)

    # Preparar las operaciones de actualización
    update_operations = {
        "$set": {
            "create_mode": create_mode,
            "use_mode": use_mode,
            "base_id": base_id
        },
        "$unset": {
            "crerate_mode": "",  # Eliminar el campo mal escrito
            "use_mode_assistant": ""
        }
    }

    try:
        # Realizar la actualización
        result = collection.update_one(
            {"_id": object_id},
            update_operations
        )

        if result.matched_count == 0:
            print(f"\nNo se encontró ningún documento con _id: {DOCUMENT_ID}")
        else:
            print(f"\nDocumento con _id: {DOCUMENT_ID} actualizado exitosamente.")
            print(f"Campos actualizados: create_mode={create_mode}, use_mode={use_mode}")
    
    except Exception as e:
        print(f"\nError al actualizar el documento: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
