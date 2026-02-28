"""
predict.py  —  OsteoAI CNN Inference
Usage: python predict.py <image_path>
Returns JSON with risk_level, probability, confidence, message
"""
import sys
import json
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

# Resolve model path relative to THIS script file — works regardless of cwd
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "osteoporosis_cnn_model.h5")

if not os.path.exists(MODEL_PATH):
    print(json.dumps({
        "error": "Model file not found. Run: python ai-model/generate_demo_model.py",
        "risk_level": "Unknown",
        "probability": 0.0,
        "confidence": "0%",
        "message": "Model not loaded."
    }))
    sys.exit(1)

try:
    # Suppress TF logs
    os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
    tf.get_logger().setLevel("ERROR")

    model = tf.keras.models.load_model(MODEL_PATH)

    img_path = sys.argv[1]
    if not os.path.exists(img_path):
        raise FileNotFoundError(f"Image not found: {img_path}")

    img = image.load_img(img_path, target_size=(128, 128))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = float(model.predict(img_array, verbose=0)[0][0])

    # Risk classification
    if prediction > 0.7:
        risk = "High"
        t_score = round(-2.5 - (prediction - 0.7) * 2, 1)
        recommendation = "Immediate consultation with orthopedic specialist recommended."
    elif prediction > 0.4:
        risk = "Moderate"
        t_score = round(-1.0 - (prediction - 0.4) * 5, 1)
        recommendation = "Schedule a DEXA scan and consult your physician."
    else:
        risk = "Low"
        t_score = round(-0.5 + (0.4 - prediction) * 2, 1)
        recommendation = "Maintain a calcium-rich diet and regular exercise."

    output = {
        "risk_level": risk,
        "probability": round(prediction, 4),
        "confidence": f"{round(prediction * 100, 2)}%",
        "t_score": t_score,
        "message": f"{risk} risk of osteoporosis detected.",
        "recommendation": recommendation
    }
    print(json.dumps(output))

except Exception as e:
    print(json.dumps({
        "error": str(e),
        "risk_level": "Unknown",
        "probability": 0.0,
        "confidence": "0%",
        "t_score": 0.0,
        "message": "Prediction failed.",
        "recommendation": "Please try again with a valid X-ray image."
    }))
    sys.exit(1)