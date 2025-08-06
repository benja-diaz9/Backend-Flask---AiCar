import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from collections import Counter

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

def calculate_metrics(collection):
    documents = list(collection.find())
    total_docs = len(documents)
    
    if total_docs == 0:
        print("No hay documentos en la colección para calcular métricas.")
        return
    
    # Calcular tiempo promedio gastado
    total_time = sum(doc.get('time_spent', 0) for doc in documents)
    average_time = total_time / total_docs
    
    # Calcular porcentajes de experiencias
    experiences = [doc.get('experience', 'neutro').lower() for doc in documents]
    experience_counts = Counter(experiences)
    
    # Asegurarse de que las claves existen
    for key in ['positivo', 'neutro', 'negativo']:
        if key not in experience_counts:
            experience_counts[key] = 0
    
    percentage_positivo = (experience_counts['positivo'] / total_docs) * 100
    percentage_neutro = (experience_counts['neutro'] / total_docs) * 100
    percentage_negativo = (experience_counts['negativo'] / total_docs) * 100
    
    # Mostrar las métricas
    print("=== Métricas de la Colección 'responses_TCO' ===")
    print(f"Total de documentos: {total_docs}")
    print(f"Tiempo Promedio Gastado: {average_time:.2f} segundos")
    print("Porcentaje de Experiencias:")
    print(f"  Positivo: {percentage_positivo:.2f}%")
    print(f"  Neutro: {percentage_neutro:.2f}%")
    print(f"  Negativo: {percentage_negativo:.2f}%")

def main():
    client = connect_mongo(MONGO_URI)
    db = client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]
    
    calculate_metrics(collection)

    # Cerrar la conexión
    client.close()

if __name__ == "__main__":
    main()
