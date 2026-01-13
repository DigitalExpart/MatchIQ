# Custom AI Architecture - Self-Hosted Semantic Understanding

## Overview

Build a custom NLP (Natural Language Processing) system for Amora that runs entirely on your own infrastructure, with no dependency on OpenAI, Anthropic, or any third-party AI APIs.

## Why Custom AI?

### Advantages
- ✅ **Full control**: Own your data, models, and logic
- ✅ **No API costs**: One-time setup, predictable hosting costs
- ✅ **No rate limits**: Scale as needed
- ✅ **Privacy**: User data never leaves your servers
- ✅ **Customization**: Train on your specific domain
- ✅ **No vendor lock-in**: Independent of OpenAI/Anthropic

### Tradeoffs
- ⚠️ More initial development time (2-4 weeks)
- ⚠️ Requires ML expertise or learning
- ⚠️ Need GPU for training (can use CPU for inference)
- ⚠️ Model quality depends on training data

---

## System Architecture

```
User Input
    ↓
Text Preprocessing (tokenization, normalization)
    ↓
Embedding Generator (sentence-transformers, local)
    ↓
Semantic Similarity Matcher (cosine similarity)
    ↓
Emotional Signal Detector (custom classifier)
    ↓
Intent Classifier (custom classifier)
    ↓
Response Strategy Selector (rule-based)
    ↓
Template Selector (semantic matching)
    ↓
Response Generator (template + context)
    ↓
Personalization Layer (user history)
    ↓
Response
```

---

## Tech Stack (100% Self-Hosted)

### Core Components

1. **Sentence Embeddings**: `sentence-transformers` (open-source, local)
   - Model: `all-MiniLM-L6-v2` (lightweight, fast, 80MB)
   - Converts text to 384-dimensional vectors
   - Runs on CPU, no GPU needed

2. **Semantic Matching**: `scikit-learn` + `numpy`
   - Cosine similarity for finding closest templates
   - Fast, efficient, battle-tested

3. **Emotional Detection**: Custom classifier
   - Train on labeled emotional data
   - `scikit-learn` or `fastai` for training
   - Deploy as pickle file (small, fast)

4. **Intent Classification**: Custom multi-label classifier
   - Train on conversational data
   - Multi-output model (7 intents)
   - Lightweight, fast inference

5. **Template Storage**: PostgreSQL (Supabase)
   - Store pre-written responses
   - Organize by intent + emotion
   - Easy to update and version

---

## Component Details

### 1. Embedding Generator (Semantic Understanding)

**Purpose**: Convert text to vectors for semantic matching

**Implementation**:
```python
from sentence_transformers import SentenceTransformer

class EmbeddingGenerator:
    def __init__(self):
        # Load model once at startup (80MB, runs on CPU)
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
    
    def embed(self, text: str) -> np.ndarray:
        """Convert text to 384-dimensional vector."""
        return self.model.encode(text, show_progress_bar=False)
    
    def similarity(self, text1: str, text2: str) -> float:
        """Compute semantic similarity (0.0-1.0)."""
        emb1 = self.embed(text1)
        emb2 = self.embed(text2)
        return cosine_similarity([emb1], [emb2])[0][0]
```

**Example**:
```python
gen = EmbeddingGenerator()

# These are semantically similar even with different words
similarity = gen.similarity(
    "I'm confused about my relationship",
    "I don't know what to do about my partner"
)
# Returns: 0.72 (high similarity)
```

### 2. Emotional Signal Detector

**Purpose**: Detect 7 emotional signals with confidence scores

**Training Data Structure**:
```csv
text,confusion,sadness,anxiety,frustration,hope,emotional_distance,overwhelm
"I don't know what to do",1.0,0.3,0.8,0.2,0.0,0.0,0.7
"I'm so happy with them",0.0,0.0,0.0,0.0,1.0,0.0,0.0
"Should I stay or leave?",0.9,0.4,0.7,0.3,0.2,0.1,0.6
```

**Training**:
```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor

class EmotionalDetector:
    def __init__(self):
        self.embedding_gen = EmbeddingGenerator()
        self.model = self._load_or_train_model()
    
    def _load_or_train_model(self):
        # Load pre-trained model or train new one
        model = MultiOutputRegressor(
            RandomForestRegressor(n_estimators=100, max_depth=10)
        )
        # Train on labeled data
        # X = embeddings, y = emotion scores
        return model
    
    def detect(self, text: str) -> Dict[str, float]:
        """Return emotion scores 0.0-1.0."""
        embedding = self.embedding_gen.embed(text)
        scores = self.model.predict([embedding])[0]
        
        return {
            "confusion": scores[0],
            "sadness": scores[1],
            "anxiety": scores[2],
            "frustration": scores[3],
            "hope": scores[4],
            "emotional_distance": scores[5],
            "overwhelm": scores[6]
        }
```

### 3. Intent Classifier (Multi-Label)

**Purpose**: Detect user intent with probabilities

**Training Data**:
```csv
text,greeting_testing,venting,reflection,advice_seeking,reassurance_seeking,decision_making,curiosity_learning
"Hi, what can you do?",1.0,0.0,0.0,0.0,0.0,0.0,0.0
"I just need to talk",0.0,1.0,0.3,0.0,0.2,0.0,0.0
"What should I do?",0.0,0.0,0.0,1.0,0.0,0.8,0.0
```

**Implementation**:
```python
class IntentClassifier:
    def __init__(self):
        self.embedding_gen = EmbeddingGenerator()
        self.model = self._load_or_train_model()
    
    def classify(self, text: str) -> Dict[str, float]:
        """Return intent probabilities."""
        embedding = self.embedding_gen.embed(text)
        probs = self.model.predict_proba([embedding])
        
        return {
            "greeting_testing": probs[0][1],
            "venting": probs[1][1],
            "reflection": probs[2][1],
            "advice_seeking": probs[3][1],
            "reassurance_seeking": probs[4][1],
            "decision_making": probs[5][1],
            "curiosity_learning": probs[6][1]
        }
```

### 4. Template Storage & Matching

**Database Schema**:
```sql
CREATE TABLE amora_templates (
    id UUID PRIMARY KEY,
    category VARCHAR(50),  -- 'love', 'confusion', 'readiness', etc.
    emotional_state VARCHAR(50),  -- 'high_confusion', 'high_anxiety', etc.
    confidence_level VARCHAR(10),  -- 'LOW', 'MEDIUM', 'HIGH'
    example_questions TEXT[],  -- Sample questions for this template
    response_template TEXT,  -- The actual response
    embedding VECTOR(384),  -- Pre-computed embedding for semantic search
    priority INT DEFAULT 0,  -- Higher priority = checked first
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for fast similarity search
CREATE INDEX ON amora_templates USING ivfflat (embedding vector_cosine_ops);
```

**Semantic Template Matching**:
```python
class TemplateSelector:
    def __init__(self, supabase, embedding_gen):
        self.supabase = supabase
        self.embedding_gen = embedding_gen
    
    def find_best_template(
        self,
        question: str,
        emotional_signals: Dict[str, float],
        confidence_level: str
    ) -> str:
        """Find most semantically similar template."""
        
        # Generate question embedding
        question_embedding = self.embedding_gen.embed(question)
        
        # Find templates with similar confidence level
        templates = self.supabase.table("amora_templates") \
            .select("*") \
            .eq("confidence_level", confidence_level) \
            .execute()
        
        # Compute similarity scores
        best_template = None
        best_score = 0.0
        
        for template in templates.data:
            # Cosine similarity with template embedding
            score = cosine_similarity(
                [question_embedding],
                [template['embedding']]
            )[0][0]
            
            # Boost score if emotions match
            if self._emotions_match(emotional_signals, template['emotional_state']):
                score *= 1.2
            
            if score > best_score:
                best_score = score
                best_template = template
        
        return best_template['response_template']
```

### 5. Response Generation (Template + Context)

**Purpose**: Personalize template with user context

```python
class ResponseGenerator:
    def generate(
        self,
        template: str,
        context: Dict[str, Any],
        emotional_signals: Dict[str, float]
    ) -> str:
        """Personalize template with context."""
        
        # Replace placeholders
        response = template
        
        # Add emotional reflection if high emotion detected
        if emotional_signals['confusion'] > 0.7:
            response = "It sounds like you're feeling really confused. " + response
        elif emotional_signals['anxiety'] > 0.7:
            response = "I can sense some anxiety in what you're sharing. " + response
        
        # Add continuity if returning user
        if context.get('previous_topics'):
            last_topic = context['previous_topics'][-1]
            response += f"\n\nI remember we talked about {last_topic} before. Is this related?"
        
        return response
```

---

## Training Pipeline

### Step 1: Data Collection

**Option A: Use Existing Datasets**
- Emotional detection: EmotionX, GoEmotions (free, open-source)
- Intent classification: Create 100-200 labeled examples
- Template responses: Write 50-100 high-quality responses

**Option B: Generate Synthetic Data**
- Use GPT-4 one-time to generate training data
- Export and never call API again
- Fine-tune on your own hardware

### Step 2: Model Training

```python
# Train emotional detector
from sklearn.model_selection import train_test_split

# Load training data
X_train, X_test, y_train, y_test = load_emotional_data()

# Train model
model = MultiOutputRegressor(RandomForestRegressor())
model.fit(X_train, y_train)

# Evaluate
score = model.score(X_test, y_test)
print(f"R² Score: {score}")  # Target: >0.80

# Save model
import joblib
joblib.dump(model, 'models/emotional_detector.pkl')
```

### Step 3: Template Creation

Create 50-100 templates covering:
- Love & confusion (10 templates)
- Readiness & commitment (8 templates)
- Communication (6 templates)
- Trust & boundaries (8 templates)
- Decision-making (10 templates)
- Venting/emotional support (8 templates)

### Step 4: Embedding Pre-computation

```python
# Pre-compute embeddings for all templates
def precompute_embeddings():
    embedding_gen = EmbeddingGenerator()
    templates = supabase.table("amora_templates").select("*").execute()
    
    for template in templates.data:
        # Compute embedding for example questions
        questions = template['example_questions']
        avg_embedding = np.mean([
            embedding_gen.embed(q) for q in questions
        ], axis=0)
        
        # Store in database
        supabase.table("amora_templates") \
            .update({"embedding": avg_embedding.tolist()}) \
            .eq("id", template['id']) \
            .execute()
```

---

## Infrastructure Requirements

### Compute
- **CPU**: 2 vCPU minimum (4 recommended)
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 500MB for models + code
- **GPU**: Not required (CPU inference is fast enough)

### Costs (Estimated)
- **Render Instance**: $7-15/month (standard instance)
- **Supabase**: Free tier (sufficient for 1000 users)
- **Total**: $7-15/month (vs $2,400-3,600 for OpenAI)

### Performance
- **Cold start**: ~3 seconds (model loading)
- **Inference time**: 50-200ms per request
- **Concurrent users**: 50-100 on single instance

---

## Development Timeline

### Week 1: Foundation
- Set up sentence-transformers
- Implement embedding generator
- Build semantic similarity matcher
- Create template database schema

### Week 2: ML Models
- Collect/create training data
- Train emotional detector
- Train intent classifier
- Evaluate and tune models

### Week 3: Integration
- Build response generation pipeline
- Integrate with existing API
- Add template management system
- Create admin interface for templates

### Week 4: Testing & Refinement
- Test with real conversations
- Collect feedback
- Improve templates
- Optimize performance

---

## Maintenance

### Monthly Tasks
- Review conversations that got poor ratings
- Add new templates for common questions
- Retrain models with new data (optional)
- Monitor performance metrics

### Yearly Tasks
- Major model retraining
- Update sentence-transformers model
- Expand template library

---

## Advantages Over V1 (Keyword Matching)

| Feature | V1 Keyword | Custom AI |
|---------|-----------|-----------|
| Understanding | Exact match | Semantic |
| Flexibility | Rigid | Adaptive |
| New questions | Add pattern | Auto-handles |
| Maintenance | Manual patterns | Update templates |
| Quality | Good (80%) | Excellent (90%) |
| Cost | $0 | $7-15/month |
| Latency | <50ms | ~100ms |

---

## Advantages Over V2 (OpenAI)

| Feature | OpenAI API | Custom AI |
|---------|------------|-----------|
| Cost | $2,400-3,600/mo | $7-15/mo |
| Control | Limited | Full |
| Privacy | Data leaves server | Data stays local |
| Customization | Prompt engineering | Model training |
| Vendor risk | High (API changes) | None |
| Quality | Excellent (95%) | Excellent (90%) |

---

## Example Implementation

See `backend/app/services/custom_ai_service.py` for complete code.

---

## Next Steps

1. **Choose this path?** Confirm you want custom AI
2. **Set up environment**: Install sentence-transformers
3. **Create training data**: 100-200 labeled examples
4. **Train models**: Emotional + intent classifiers
5. **Build templates**: 50-100 response templates
6. **Integrate**: Replace current keyword system
7. **Test**: Real conversations
8. **Deploy**: Render with models included

---

**Estimated Time to Production**: 3-4 weeks  
**Estimated Monthly Cost**: $7-15  
**Quality**: 90-92% user satisfaction (realistic goal)

This is a **production-grade, self-hosted AI system** with no third-party dependencies.
