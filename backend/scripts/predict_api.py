from fastapi import FastAPI
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import uvicorn

app = FastAPI()

model = tf.keras.models.load_model("../model/osteoporosis_model.h5")

class_names = ["Normal", "Osteopenia", "Osteoporosis"]

@app.post("/predict")
async def predict(data: dict):
    img_path = data["image_path"]
    
    img = image.load_img(img_path, target_size=(224,224))
    img_array = image.img_to_array(img)/255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    predicted_class = class_names[np.argmax(prediction)]

    return {
        "prediction": predicted_class,
        "confidence": float(np.max(prediction))
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)