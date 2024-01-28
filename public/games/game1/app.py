from fastapi import FastAPI, WebSocket
from fastapi import FastAPI, UploadFile, File
from typing import BinaryIO
import librosa
import numpy as np
import io
from pydub import AudioSegment
from scipy.signal import butter, filtfilt

app = FastAPI()


def butter_bandpass(lowcut, highcut, fs, order=5):
    nyquist = 0.5 * fs
    low = lowcut / nyquist
    high = highcut / nyquist
    b, a = butter(order, [low, high], btype='band')
    return b, a

def butter_bandpass_filter(data, lowcut, highcut, fs, order=5):
    b, a = butter_bandpass(lowcut, highcut, fs, order=order)
    y = filtfilt(b, a, data)
    return y

@app.post("/voice-level")
async def analyze_filtered_voice_amplitude(audio: UploadFile = File(...)):
    contents = await audio.read()

    # Use an in-memory buffer to work with the audio chunks
    audio_buffer = io.BytesIO(contents)

    # Read the audio data from the buffer using pydub
    audio_data = AudioSegment.from_file(audio_buffer)

    # Convert audio data to numpy array
    samples = np.array(audio_data.get_array_of_samples())

    # Constants for bandpass filter (adjust these values as needed)
    lowcut = 300  # Lower cutoff frequency for human voice
    highcut = 3400  # Upper cutoff frequency for human voice
    fs = audio_data.frame_rate  # Sampling frequency

    # Apply bandpass filter to isolate human voice frequencies
    filtered_samples = butter_bandpass_filter(samples, lowcut, highcut, fs)

    # Calculate amplitude of the filtered signal
    amplitude = np.abs(filtered_samples).mean()
    normalized_amplitude = ((amplitude-1000) / 5000000)*100
    

    return {"amplitude": amplitude,"normalized_amplitude": normalized_amplitude}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
