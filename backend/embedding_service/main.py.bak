# main.py
import os
from time import sleep
import openai
from packaging import version
from flask import Flask, request, jsonify
import functions
from pymongo import MongoClient
from flask_cors import CORS
import time

# 1) Versión mínima de la librería OpenAI
required_version = version.parse("1.1.1")
current_version = version.parse(openai.__version__)
if current_version < required_version:
    raise ValueError(f"La versión de OpenAI {openai.__version__} es menor que 1.1.1")
print("La versión de OpenAI es compatible.")

# 2) API key y endpoint regional (opcional)
OPENAI_API_KEY = os.environ['OPENAI_API_KEY']
openai.api_key = OPENAI_API_KEY
openai.api_base = os.getenv("OPENAI_API_BASE", "https://api.openai.saopaulo.example.com/v1")
openai.request_headers = {"OpenAI-Beta": "assistants=v2"}

# 3) Flask + MongoDB
app = Flask(__name__)
CORS(app)
client = MongoClient("mongodb://172.17.0.1:27019/")
try:
    client.admin.command('ping')
    print("Conexión exitosa a MongoDB")
except Exception as e:
    print(f"Error al conectar: {e}")

# 4) Modos desde la BD
create_mode, use_mode, name_bot, base_id = functions.get_modes()
print(f"create_mode: {create_mode}, use_mode: {use_mode}")

# 5) Crear asistente si corresponde
assistant_id_created = None
if create_mode:
    assistant_id_created = functions.create_assistant(openai, name_bot)
    print(f"Se creó un nuevo assistant con ID: {assistant_id_created}")

# 6) Rutas
if not use_mode:
    @app.route('/start/<assistant_id>')
    def start_disabled(assistant_id):
        return jsonify({"error": "use_mode es False"}), 403

    @app.route('/chat/<assistant_id>', methods=['POST'])
    def chat_disabled(assistant_id):
        return jsonify({"error": "use_mode es False"}), 403

else:
    @app.route('/start', defaults={'assistant_id': None}, methods=['GET'])
    @app.route('/start/<assistant_id>', methods=['GET'])
    def start_conversation(assistant_id):
        if assistant_id is None:
            if not base_id:
                return jsonify({"error": "No assistant_id y no hay base_id."}), 400
            assistant_id = base_id

        thread = openai.beta.threads.create()
        # “Calentar” el modelo inyectando instrucciones como rol assistant
        initial_context = functions.load_initial_context(name_bot)
        openai.beta.threads.messages.create(
            thread_id=thread.id,
            role="assistant",
            content=initial_context
        )
        return jsonify({"thread_id": thread.id})

    @app.route('/chat', defaults={'assistant_id': None}, methods=['POST'])
    @app.route('/chat/<assistant_id>', methods=['POST'])
    def chat(assistant_id):
        if assistant_id is None:
            if not base_id:
                return jsonify({"error": "No assistant_id y no hay base_id."}), 400
            assistant_id = base_id

        data = request.json
        thread_id = data.get('thread_id')
        user_input = data.get('message', '')
        if not thread_id:
            return jsonify({"error": "Falta el thread_id"}), 400

        # Solo adjuntar el nuevo mensaje
        openai.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=user_input
        )

        # Ejecutar el asistente SIN params (no soportado en esta versión)
        run = openai.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=assistant_id
        )

        # Polling hasta completion
        while True:
            status = openai.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id).status
            if status == 'completed':
                break
            sleep(1)

        # Devolver respuesta
        msg = openai.beta.threads.messages.list(thread_id=thread_id).data[0].content[0].text.value
        return jsonify({"response": msg})

    @app.route('/save', defaults={'assistant_id': None}, methods=['POST'])
    @app.route('/save/<assistant_id>', methods=['POST'])
    def save_conversation(assistant_id):
        collection = client['responses']['responses_TCO']
        data = request.json
        doc = {
            "assistant_id": assistant_id,
            "conversation_id": data.get("conversation_id"),
            "time_spent": data.get("time_spent"),
            "experience": data.get("experience"),
            "conversation": data.get("conversation"),
            "timestamp": data.get("timestamp"),
            "saved_at": time.time()
        }
        result = collection.insert_one(doc)
        return jsonify({"inserted_id": str(result.inserted_id)}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
