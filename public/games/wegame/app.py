from fastapi import FastAPI, UploadFile, File
import numpy as np
import io
from pydub import AudioSegment
from scipy.signal import butter, filtfilt
import tensorflow as tf
import tensorflow_hub as hub
import csv
import scipy
from scipy.io.wavfile import write
from scipy.io import wavfile
from pydub import AudioSegment
from pydub.effects import normalize


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def read_audio_data1(file_contents):
    audio_buffer = io.BytesIO(file_contents)
    audio_data = AudioSegment.from_file(audio_buffer)
    original_sample_rate = audio_data.frame_rate
    audio_data_s16 = audio_data.set_sample_width(2).set_frame_rate(16000)
    return audio_data_s16, 16000

def read_audio_data2(file_contents):
    audio_buffer = io.BytesIO(file_contents)
    audio_data = AudioSegment.from_file(audio_buffer)
    original_sample_rate = audio_data.frame_rate
    
    # Volume normalization
    normalized_audio = normalize(audio_data)

    # Noise reduction (optional)
    # You can apply additional noise reduction techniques if needed
    
    # Convert to s16 format with a sample rate of 16000 Hz
    audio_data_s16 = normalized_audio.set_sample_width(2).set_frame_rate(16000)
    
    return audio_data_s16, 16000
    
def class_names_from_csv(class_map_csv_text):
  """Returns list of class names corresponding to score vector."""
  class_names = []
  with tf.io.gfile.GFile(class_map_csv_text) as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
      class_names.append(row['display_name'])

  return class_names


yamnet_model = hub.load('https://tfhub.dev/google/yamnet/1')
class_map_path = yamnet_model.class_map_path().numpy()
class_names = class_names_from_csv(class_map_path)

def analyze_yamnet(audio_samples, sample_rate):
    # Convert bytes to numpy array
    audio_samples_np = np.frombuffer(audio_samples, dtype=np.int16)

    # Ensure sample rate is 16,000 Hz
    if sample_rate != 16000:
        audio_samples_np = scipy.signal.resample(audio_samples_np, int(len(audio_samples_np) * 16000 / sample_rate))

    # Normalize the audio samples
    audio_samples_normalized = audio_samples_np / np.iinfo(np.int16).max

    # Run YAMNet model
    scores, _, _ = yamnet_model(audio_samples_normalized)
    scores_np = scores.numpy()

    # Get the inferred class and its score
    inferred_class_index = scores_np.mean(axis=0).argmax()
    inferred_class = class_names[inferred_class_index]
    inferred_class_score = float(scores_np.mean(axis=0)[inferred_class_index])
    
    print(inferred_class, ":", inferred_class_score)

    return {"class": inferred_class, "score": inferred_class_score}



@app.post("/clap")
async def analyze_clap(audio: UploadFile = File(...)):
    contents = await audio.read()
    audio_data, sample_rate = read_audio_data2(contents)
    #save audio_data to file
    #audio_data.export("audio.wav", format="wav")
    
    applause_analysis = analyze_yamnet(audio_data.raw_data, sample_rate)
    score=0
    if applause_analysis["class"] in ["Hands","Applause","Knock"]:
       score=applause_analysis["score"]
    return {"score": score}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9000, workers=1)
