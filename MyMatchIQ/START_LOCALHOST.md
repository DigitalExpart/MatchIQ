# Starting Localhost - Quick Guide

## Start Backend Server (Port 8000)

### Option 1: PowerShell (Recommended)
```powershell
cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ\backend"
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Option 2: Using Batch File
```powershell
cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ\backend"
.\start_backend.bat
```

### Verify Backend is Running
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing
```

**Backend API Docs:** http://localhost:8000/docs

---

## Start Frontend Server (Port 3000 or 5173)

### PowerShell Command
```powershell
cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ"
npm run dev
```

### Verify Frontend is Running
Open your browser and go to:
- **Frontend:** http://localhost:3000 (or check terminal output for actual port)

---

## Start Both Servers (Two Terminal Windows)

### Terminal 1 - Backend:
```powershell
cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ\backend"
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend:
```powershell
cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ"
npm run dev
```

---

## Quick Start Script (PowerShell)

Run this in PowerShell to start both:

```powershell
# Start Backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\Shilley Pc\MatchIQ\MyMatchIQ\backend'; python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend
cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ"
npm run dev
```

---

## Troubleshooting

### Backend won't start?
1. Check if Python dependencies are installed:
   ```powershell
   cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ\backend"
   pip install -r requirements.txt
   ```

2. Check if port 8000 is already in use:
   ```powershell
   netstat -ano | findstr :8000
   ```

### Frontend won't start?
1. Check if Node modules are installed:
   ```powershell
   cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ"
   npm install
   ```

2. Check if port 3000/5173 is already in use:
   ```powershell
   netstat -ano | findstr :3000
   netstat -ano | findstr :5173
   ```

---

## URLs After Starting

- **Frontend:** http://localhost:3000 (or port shown in terminal)
- **Backend API:** http://localhost:8000/api/v1
- **Backend Docs:** http://localhost:8000/docs
- **Backend Health:** http://localhost:8000/health

