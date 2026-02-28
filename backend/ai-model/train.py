import os
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator

DATASET = "../dataset/osteoporosis"
MODEL_PATH = "osteoporosis_cnn_model.h5"

datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

train = datagen.flow_from_directory(DATASET, target_size=(128,128),
                                     class_mode='binary', subset='training')
val = datagen.flow_from_directory(DATASET, target_size=(128,128),
                                   class_mode='binary', subset='validation')

model = models.Sequential([
    layers.Conv2D(32,(3,3),activation='relu',input_shape=(128,128,3)),
    layers.MaxPooling2D(),
    layers.Conv2D(64,(3,3),activation='relu'),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(128,activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(1,activation='sigmoid')
])

model.compile(optimizer='adam',loss='binary_crossentropy',metrics=['accuracy'])
model.fit(train,validation_data=val,epochs=5)
model.save(MODEL_PATH)