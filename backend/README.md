# 🦴 AI-Powered Early Osteoporosis Detection System — Backend

A **production-ready, hackathon-grade** REST API backend for AI-powered osteoporosis detection from X-ray images. Built with Node.js + Express, MySQL, and a Python TensorFlow CNN.

---

## 🚀 Quick Start

### 1. Install Node.js Dependencies
```bash
cd backend
npm install
```

### 2. Install Python Dependencies
```bash
pip install -r ai-model/requirements.txt
```

### 3. Configure Environment
Edit `.env` and set your MySQL credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=osteoporosis_db
JWT_SECRET=your_secret_key
```

### 4. Start the Server
```bash
npm start
# or for auto-reload:
npm run dev
```

The server starts at **http://localhost:5000** and auto-creates the database and tables on startup.

---

## 🧠 AI Model Setup

### Option A — Upload a Dataset via API
```bash
curl -X POST http://localhost:5000/api/dataset/upload \
  -F "dataset=@/path/to/dataset.zip"
```
The ZIP must contain `normal/` and `osteoporosis/` subdirectories.

### Option B — Place Images Manually
```
dataset/
└── osteoporosis/
    ├── normal/          ← Add healthy bone X-rays here
    └── osteoporosis/    ← Add osteoporotic X-rays here
```

### Train the Model
```bash
npm run train
# or directly:
python ai-model/train_model.py
```
Model saves to `ai-model/osteoporosis_cnn_model.h5`

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Create new account |
| POST | `/api/login` | Login and get JWT |
| GET | `/api/profile` | Get current user (auth required) |

**Register:**
```json
POST /api/register
{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }
```

**Login:**
```json
POST /api/login
{ "email": "john@example.com", "password": "secret123" }
```
Returns: `{ "token": "eyJ...", "user": { ... } }`

---

### Prediction

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict` | Upload X-ray, get AI prediction |
| POST | `/api/dataset/upload` | Upload training dataset ZIP |
| POST | `/api/model/train` | Trigger model training |

**Predict:**
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Authorization: Bearer <token>" \
  -F "xray=@/path/to/xray.jpg"
```

**Response:**
```json
{
  "success": true,
  "scan_id": 1,
  "risk_level": "High",
  "probability": 0.87,
  "confidence": "92%",
  "message": "High risk of osteoporosis detected. Please consult a specialist immediately.",
  "interpretation": "AI analysis indicates HIGH RISK (87% probability)...",
  "prediction_time_ms": 142,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### Reports & Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/:userId` | User scan history + summary |
| GET | `/api/report/:scanId` | Detailed medical report |
| GET | `/api/admin/scans` | All scans (admin only) |
| GET | `/api/model/metrics` | CNN model performance metrics |
| GET | `/health` | Server health check |

---

## 🗄 Database Schema

```sql
-- Auto-created on server start
users  (id, name, email, password, role, created_at)
scans  (id, user_id, image_path, probability, risk_level, confidence, prediction_time_ms, interpretation, created_at)
```

---

## 📂 Folder Structure

```
backend/
├── server.js              Main Express server
├── .env                   Environment config
├── package.json
├── config/
│   ├── database.js        MySQL pool + auto-init
│   ├── modelLoader.js     Model existence check + training
│   └── logger.js          Winston logger
├── controllers/
│   ├── authController.js
│   ├── predictionController.js
│   └── reportController.js
├── routes/
│   ├── authRoutes.js
│   ├── predictionRoutes.js
│   └── reportRoutes.js
├── middleware/
│   ├── authMiddleware.js  JWT verification
│   └── uploadMiddleware.js Multer image/ZIP upload
├── models/
│   ├── userModel.js
│   └── scanModel.js
├── scripts/
│   └── extractDataset.js  ZIP extraction utility
├── ai-model/
│   ├── train_model.py     CNN training (TensorFlow)
│   ├── predict.py         Inference script
│   └── requirements.txt
├── dataset/
│   └── osteoporosis/
│       ├── normal/
│       └── osteoporosis/
├── uploads/               Uploaded X-rays
└── logs/                  Server log files
```

---

## 🔒 Security Features
- JWT authentication with expiry
- bcrypt password hashing (12 rounds)
- Rate limiting (100 req/15min global, 10/min for predictions)
- Helmet.js security headers
- File type validation on uploads
- CORS enabled

---

## 🏥 Risk Level Interpretation

| Risk Level | Probability | Recommendation |
|------------|-------------|----------------|
| Low | < 40% | Annual screening, normal lifestyle |
| Moderate | 40-70% | DEXA scan, supplementation advised |
| High | > 70% | **Immediate specialist consultation** |
