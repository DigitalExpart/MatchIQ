"""
Train custom emotional detector model.
Creates a model that detects 7 emotional signals from text.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
import joblib

# Training data (you can expand this significantly)
TRAINING_DATA = [
    # (text, [confusion, sadness, anxiety, frustration, hope, emotional_distance, overwhelm])
    ("I don't know what to do", [1.0, 0.3, 0.8, 0.2, 0.0, 0.0, 0.7]),
    ("I'm so confused about my feelings", [0.9, 0.4, 0.6, 0.3, 0.1, 0.0, 0.6]),
    ("I'm happy with my relationship", [0.0, 0.0, 0.0, 0.0, 0.9, 0.0, 0.0]),
    ("Should I stay or leave?", [0.9, 0.5, 0.7, 0.3, 0.2, 0.1, 0.6]),
    ("I'm so frustrated with him", [0.2, 0.3, 0.2, 0.9, 0.0, 0.0, 0.4]),
    ("I feel anxious about our future", [0.3, 0.4, 0.9, 0.2, 0.3, 0.0, 0.5]),
    ("I'm sad it ended", [0.1, 0.9, 0.3, 0.1, 0.0, 0.7, 0.2]),
    ("I feel distant from them", [0.3, 0.5, 0.2, 0.1, 0.0, 0.9, 0.3]),
    ("I'm overwhelmed with everything", [0.6, 0.4, 0.7, 0.3, 0.0, 0.0, 0.9]),
    ("I have hope things will get better", [0.2, 0.2, 0.2, 0.0, 0.9, 0.0, 0.1]),
    ("I'm not sure if I love them", [0.8, 0.3, 0.5, 0.1, 0.2, 0.3, 0.4]),
    ("Everything is going great!", [0.0, 0.0, 0.0, 0.0, 0.9, 0.0, 0.0]),
    ("I can't handle this anymore", [0.4, 0.6, 0.7, 0.8, 0.0, 0.2, 0.9]),
    ("I'm trying to make it work", [0.3, 0.2, 0.3, 0.2, 0.8, 0.0, 0.3]),
    ("I feel nothing anymore", [0.2, 0.7, 0.1, 0.2, 0.0, 0.9, 0.3]),
    ("What should I do about this", [0.7, 0.2, 0.6, 0.3, 0.3, 0.0, 0.5]),
    ("I'm scared of losing them", [0.4, 0.5, 0.9, 0.2, 0.3, 0.0, 0.5]),
    ("I'm angry at how they treated me", [0.1, 0.3, 0.2, 0.9, 0.0, 0.4, 0.3]),
    ("I'm hopeful we can fix this", [0.3, 0.2, 0.3, 0.1, 0.9, 0.0, 0.2]),
    ("I don't feel connected anymore", [0.4, 0.5, 0.3, 0.2, 0.1, 0.9, 0.3]),
    # Add more training examples here...
]

def train_model():
    """Train emotional detector model."""
    print("Loading sentence-transformers model...")
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("Preparing training data...")
    texts = [item[0] for item in TRAINING_DATA]
    emotions = [item[1] for item in TRAINING_DATA]
    
    # Generate embeddings
    print("Generating embeddings...")
    X = np.array([embedding_model.encode(text) for text in texts])
    y = np.array(emotions)
    
    print(f"Training data: {X.shape[0]} samples, {X.shape[1]} features, {y.shape[1]} outputs")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print("Training model...")
    model = MultiOutputRegressor(
        RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            min_samples_split=2,
            random_state=42
        )
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    print("\nEvaluating model...")
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    
    print(f"Train R² Score: {train_score:.4f}")
    print(f"Test R² Score: {test_score:.4f}")
    print(f"Mean Absolute Error: {mae:.4f}")
    
    # Save model
    os.makedirs('models', exist_ok=True)
    model_path = 'models/emotional_detector.pkl'
    joblib.dump(model, model_path)
    print(f"\n✅ Model saved to {model_path}")
    
    # Test on example
    print("\nTesting on example:")
    test_text = "I'm confused and don't know what to do"
    test_embedding = embedding_model.encode(test_text)
    prediction = model.predict([test_embedding])[0]
    
    emotions_labels = ["confusion", "sadness", "anxiety", "frustration", "hope", "emotional_distance", "overwhelm"]
    print(f"Input: '{test_text}'")
    print("Predicted emotions:")
    for label, score in zip(emotions_labels, prediction):
        print(f"  {label}: {score:.2f}")

if __name__ == "__main__":
    print("⚠️  NOTE: This is a minimal training script with only 20 examples.")
    print("For production use, expand TRAINING_DATA to 100-200+ examples.")
    print("You can use datasets like GoEmotions or create your own.\n")
    
    train_model()
