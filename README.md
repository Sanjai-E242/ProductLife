# ProductLife — Digital Product Passport (DPP) Platform

ProductLife is a full-stack Digital Product Passport platform with a Spring Boot REST API backend and a React + Vite frontend.

---

## 🚀 Currently Running Services

Both services are active and running on `localhost`:

| Service | URL | Notes |
|---|---|---|
| **Frontend** | [http://localhost:5174](http://localhost:5174) | React + Vite UI (Product Explorer, Passport Views, Admin Portal) |
| **Backend API** | [http://localhost:8081](http://localhost:8081) | Spring Boot REST API (`/api/products`, `/api/health`) |
| **Database Console** | [http://localhost:8081/h2-console](http://localhost:8081/h2-console) | JDBC URL: `jdbc:h2:file:./data/productlife`, User: `sa`, Password: *(empty)* |

---

## 🔑 Default Administrator Credentials

To access the Admin Portal at [http://localhost:5174/admin/login](http://localhost:5174/admin/login):
- **Username:** `admin`
- **Password:** `admin123`

---

## 🛠️ How to Start the Project in the Future

### Quick Start (Windows)
Double-click `start_project.bat` or run:
```powershell
.\start_project.bat
```

### Manual Start

#### Backend:
```powershell
cd backend
.\run_backend.ps1
```
*(Runs on port 8081 with persistent embedded database and auto-seeded demonstration products)*

#### Frontend:
```powershell
cd frontend
npm run dev
```
*(Runs on port 5174)*

---

## 🗄️ Database Options

1. **Embedded H2 (Default):**
   - Zero setup required. Automatically stores data locally in `backend/data/productlife.mv.db`.
   - Seeded with 4 demonstration products and lifecycle repair records.
2. **External MySQL (Optional):**
   - To connect to a local or remote MySQL instance, edit [backend/.env](file:///c:/Users/jmsar/Downloads/ProductLife-main/ProductLife-main/backend/.env):
     ```env
     DB_URL=jdbc:mysql://127.0.0.1:3306/productlife?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
     DB_USERNAME=productlife_app
     DB_PASSWORD=your_password
     ```
