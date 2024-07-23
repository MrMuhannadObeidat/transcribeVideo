import os
import wave
import json
from vosk import Model, KaldiRecognizer
vosk_model_path = {add_your_vosk_model_base_path} # (Big US English model with dynamic graph, vosk-model-en-us-0.22-lgraph)


model_path = vosk_model_path
audio_path = "../output/fin24.wav"  # Replace with the path to your audio file

if not os.path.exists(model_path):
    print(f"Model not found at {model_path}")
    exit(1)

model = Model(model_path)
wf = wave.open(audio_path, "rb")

if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != "NONE":
    print("Audio file must be WAV format mono PCM.")
    exit(1)
print(wf.getframerate())
rec = KaldiRecognizer(model, wf.getframerate())
rec.SetWords(True)

result = ""
while True:
    data = wf.readframes(16000)
    if len(data) == 0:
        break
    if rec.AcceptWaveform(data):
        result += rec.Result()
    else:
        result += rec.PartialResult()
    
result += rec.FinalResult()
with open("../output/fin24.txt", "w") as file:
    # Write the raw result to the file
    file.write(result)

# Parse the result
result_json = json.loads(result)
print(result_json['text'])

