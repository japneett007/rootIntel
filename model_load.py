import tensorflow as tf
import json
import os
import base64
import numpy as np
from tensorflow.keras.preprocessing import image
from gtts import gTTS
import IPython.display as ipd
import speech_recognition as sr
from langdetect import detect

MODEL_PATH = "plant_disease_model (2).h5"
CLASS_JSON = "class_names (2).json"

# Read and decode the base64 image from image.json
try:
    with open('image.json', 'r') as file:
        json_data = json.load(file)

    if 'imageData' in json_data:
        image_data = base64.b64decode(json_data['imageData'])

        # Save the decoded image
        with open('decoded_image.jpg', 'wb') as image_file:
            image_file.write(image_data)
        image_path = 'decoded_image.jpg'
    else:
        raise KeyError("❌ 'imageData' key not found in image.json")
except Exception as e:
    print("Error reading image.json:", e)
    image_path = None

# Load model and class names
if os.path.exists(MODEL_PATH):
    model = tf.keras.models.load_model(MODEL_PATH)
    with open(CLASS_JSON, "r") as f:
        class_names = json.load(f)
else:
    print("Model or class names not found.")
    model = None
    class_names = []

# Disease treatment guide
treatment_guide = {
    "Apple_Scab": "Apply fungicides like captan or mancozeb...",
    "Black_Rot": "Remove infected fruit and apply fungicide sprays...",
    "Healthy": "No treatment needed. Maintain good hygiene...",
    # (... all others ...)
    "Yellow_Leaf_Curl_Virus": "Remove infected plants and control whiteflies..."
}

# Function to generate a report
def generate_report(class_name):
    return treatment_guide.get(class_name, "No specific treatment found. Consult an expert.")

# Prediction function
def predict_and_report(image_path):
    if image_path is None or model is None:
        print("Prediction cannot proceed. Check image or model.")
        return

    try:
        img_height, img_width = 224, 224  # Set according to your model input
        img = image.load_img(image_path, target_size=(img_height, img_width))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        pred = model.predict(img_array)
        pred_class = class_names[np.argmax(pred)]
        report = generate_report(pred_class)

        print(f"✅ Prediction: {pred_class}")
        print(f"🧪 Treatment Report: {report}")
        return report
    except Exception as e:
        print("Error during prediction:", e)

# Voice recognition and translation
def listen_and_translate():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("🎤 Speak now...")
        audio = recognizer.listen(source)
        try:
            text = recognizer.recognize_google(audio)
            lang = detect(text)
            print(f"🌍 Detected Language: {lang}")
            print("🗣️ You said:", text)
            return text, lang
        except Exception as e:
            print("❌ Could not understand audio:", str(e))
            return None, None

# Text-to-speech
def speak(text, lang='en'):
    try:
        tts = gTTS(text=text, lang=lang)
        tts.save("speech.mp3")
        ipd.display(ipd.Audio("speech.mp3"))
    except Exception as e:
        print("🔇 Voice output error:", e)

# Run prediction if everything is ready
if image_path:
    report = predict_and_report(image_path)
    if report:
        speak(report)

predict_and_report("download.jpg")