"""
generate_demo_model.py
Run this ONCE to create a valid osteoporosis_cnn_model.h5 for demo/hackathon.
It uses the same architecture as train.py but with random weights (no dataset needed).

Usage:
  cd backend/ai-model
  python generate_demo_model.py
"""
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models

print("Building demo CNN model (same architecture as production)...")

model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(128, 128, 3)),
    layers.MaxPooling2D(),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Save with random weights — structurally identical to a trained model
save_path = os.path.join(os.path.dirname(__file__), "osteoporosis_cnn_model.h5")
model.save(save_path)

size_mb = os.path.getsize(save_path) / (1024 * 1024)
print(f"✅ Demo model saved: {save_path}")
print(f"   File size: {size_mb:.2f} MB")
print(f"   Architecture: Conv2D → MaxPooling → Conv2D → MaxPooling → Dense(128) → Dense(1)")
print("\nThe model is ready! Start the backend with: node server.js")
