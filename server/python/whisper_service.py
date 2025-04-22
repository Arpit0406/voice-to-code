import whisper
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile

app = Flask(__name__)
CORS(app)
model = whisper.load_model('base')

@app.route('/transcribe', methods=['POST'])
def transcribe():
    audio = request.files['audio']
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
        audio.save(temp_audio.name)
        result = model.transcribe(temp_audio.name)
    return jsonify({'transcription': result['text']})

if __name__ == '__main__':
    app.run(port=5000)