from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db
import json
import os

# Inicia o Flask
app = Flask(__name__)
CORS(app)  # ← isso permite que o Flask aceite requisições de outras origens

# Inicia Firebase Admin SDK

firebase_config = json.loads(os.environ["FIREBASE_CREDENTIALS"])
cred = credentials.Certificate(firebase_config)
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://coloring-web-app-default-rtdb.firebaseio.com'
})

# Define uma rota para receber POST com nome + score
@app.route("/api/new-score", methods=["POST"])
def receber_pergunta():
    data = request.get_json()
    name = data.get("name")
    score = data.get("score")

    if not name or not score:
        return jsonify({"error": "Campos obrigatórios"}), 400

    # Salva no Firebase
    ref = db.reference("scores")
    ref.push({
        "name": name,
        "score": score,
        "timestamp": request.environ.get("REQUEST_TIME", 0)
    })
    print(f"Pergunta recebida: {name} perguntou: {score}")
    return jsonify({"status": "Pergunta salva com sucesso!"}), 200

# Inicia o servidor local
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
