# Voice-to-Code Assistant\n\nRun instructions included below.

1. Start Python Whisper Backend
cd server/python
pip install flask flask-cors openai-whisper
python whisper_service.py

2. Start Node.js API Backend
cd ../../server
npm install
node index.js
(Ensure .env contains your OPENAI_API_KEY)

3. Start Frontend (React)
cd ../client
npm install
npm run dev
Open http://localhost:3000




###Manual .whl Installation (Most Reliable)
Download the following .whl files manually from the official links below.

Torch (CPU version, Python 3.11, Windows): https://download.pytorch.org/whl/cpu/torch-2.6.0%2Bcpu-cp311-cp311-win_amd64.whl

Torchvision: https://download.pytorch.org/whl/cpu/torchvision-0.21.0%2Bcpu-cp311-cp311-win_amd64.whl

Torchaudio: https://download.pytorch.org/whl/cpu/torchaudio-2.6.0%2Bcpu-cp311-cp311-win_amd64.whl

📁 Save all 3 files in your Downloads folder or any local path.

Then install them one by one:
cd C:\Users\aa17567\Downloads

pip install torch-2.6.0+cpu-cp311-cp311-win_amd64.whl
pip install torchvision-0.21.0+cpu-cp311-cp311-win_amd64.whl
pip install torchaudio-2.6.0+cpu-cp311-cp311-win_amd64.whl
