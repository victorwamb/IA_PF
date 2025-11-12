from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from pathlib import Path
import shutil
from datetime import datetime, timezone
import secrets
from dotenv import load_dotenv

# OpenAI pour le chatbot
try:
    from openai import OpenAI as OpenAI_Client
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    OpenAI_Client = None

# Charger les variables d'environnement
# Chercher le .env dans backend/ OU à la racine
_env_file_backend = Path(__file__).parent / ".env"  # backend/.env
_env_file_root = Path(__file__).parent.parent / ".env"  # racine/.env

# Charger les deux fichiers s'ils existent
env_loaded = False
if _env_file_backend.exists():
    load_dotenv(_env_file_backend)
    print(f"✅ Loaded .env from: {_env_file_backend}")
    env_loaded = True
if _env_file_root.exists():
    load_dotenv(_env_file_root, override=True)  # override pour permettre la racine d'écraser backend
    print(f"✅ Loaded .env from: {_env_file_root}")
    env_loaded = True

if not env_loaded:
    print("⚠️ No .env file found in backend/ or root directory")

app = FastAPI(title="Portfolio Admin API")

# CORS configuré via variables d'environnement
ALLOWED_ORIGINS_ENV = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001")
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

# Sécurité
security = HTTPBearer()

# Clé API : développement vs production
DEV_API_KEY = "admin2025_secret_key_change_me"
ENV_API_KEY = os.getenv("ADMIN_API_KEY")
API_KEY = ENV_API_KEY if ENV_API_KEY else DEV_API_KEY

# Avertir si on utilise la clé par défaut en production
if not ENV_API_KEY and os.getenv("ENVIRONMENT") != "development":
    print("⚠️ CRITICAL SECURITY: Using default API key! Set ADMIN_API_KEY in production!")

# OpenAI pour le chatbot (chargé côté backend de façon sécurisée)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
print(f"🔍 Checking OpenAI configuration...")
print(f"   - OPENAI_AVAILABLE: {OPENAI_AVAILABLE}")
print(f"   - OPENAI_API_KEY set: {OPENAI_API_KEY is not None}")
openai_client = None
if OPENAI_AVAILABLE and OPENAI_API_KEY:
    try:
        openai_client = OpenAI_Client(api_key=OPENAI_API_KEY)
        print("✅ OpenAI client initialized successfully")
    except Exception as e:
        print(f"⚠️ Failed to initialize OpenAI client: {e}")
else:
    if not OPENAI_AVAILABLE:
        print("⚠️ OpenAI package not installed. Install with: pip install openai")
    if not OPENAI_API_KEY:
        print("⚠️ OPENAI_API_KEY not set. Chatbot will use fallback mode.")

# Chemins des fichiers
BASE_DIR = Path(__file__).parent.parent
PROJECTS_FILE = BASE_DIR / "src" / "data" / "projects.json"
UPLOADS_DIR = BASE_DIR / "uploads"

# Créer le dossier uploads s'il n'existe pas
UPLOADS_DIR.mkdir(exist_ok=True)

# Modèles Pydantic
class Project(BaseModel):
    id: Optional[int] = None
    title: str
    titleSimple: str
    description: str
    description2: str = ""
    description3: str = ""
    details: str = ""
    technologies: List[str]
    date: str
    categorie: List[str]
    image: str = ""
    imageSimple: str = ""
    images: List[str] = []
    type: str = ""
    vue: str = ""

class ProjectCreate(BaseModel):
    title: str
    titleSimple: str
    description: str
    description2: str = ""
    description3: str = ""
    details: str = ""
    technologies: List[str]
    date: str
    categorie: List[str]
    image: str = ""
    imageSimple: str = ""
    images: List[str] = []
    type: str = ""
    vue: str = ""

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    titleSimple: Optional[str] = None
    description: Optional[str] = None
    description2: Optional[str] = None
    description3: Optional[str] = None
    details: Optional[str] = None
    technologies: Optional[List[str]] = None
    date: Optional[str] = None
    categorie: Optional[List[str]] = None
    image: Optional[str] = None
    imageSimple: Optional[str] = None
    images: Optional[List[str]] = None
    type: Optional[str] = None
    vue: Optional[str] = None

# Modèles pour le chatbot
class ChatMessage(BaseModel):
    role: str  # "user" ou "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    response: str

# Fonction de vérification de l'API key
async def verify_api_key(credentials: HTTPAuthorizationCredentials = Security(security)):
    if credentials.credentials != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return credentials.credentials

# Fonction pour charger les projets
def load_projects():
    if not PROJECTS_FILE.exists():
        return []
    try:
        with open(PROJECTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading projects: {e}")
        return []

# Fonction pour sauvegarder les projets
def save_projects(projects):
    try:
        with open(PROJECTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(projects, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error saving projects: {e}")
        return False

# Système de prompts pour le chatbot
SYSTEM_PROMPT = """You are a helpful AI assistant representing Victor Wambersie's portfolio. 
You are a Backend & AI Developer specialized in LLM integration, RAG architectures, fine-tuning, and agentic systems.

Key information:
- Name: Victor Wambersie
- Role: Backend & AI Developer
- Location: Antibes, Cannes, Nice (France)
- Email: victor.wambersie@gmail.com
- GitHub: https://github.com/bubom6755

Skills:
- Languages: Python
- Frameworks: FastAPI, Streamlit
- AI/ML: PyTorch, LLM Integration, RAG Architectures, Fine-tuning, FAISS, Agentic Systems, Prompt Engineering
- APIs: OpenAI API, Ollama

Notable Projects:
- Fairval - Legal AI: IA juridique basée sur architecture RAG avec LLaMA 3, fine-tuning et base de données vectorielle FAISS (Python, LLaMA 3, RAG, FAISS, Fine-tuning, FastAPI, Streamlit)

Education:
- MyDigitalSchool (2022-2024): Digital marketing, graphic design, web development
- Ynov Campus (2024-2027): Web development

Currently looking for: Alternance ou poste en développement Backend, ingénierie IA, ou développement de systèmes LLM

Passions: Artificial Intelligence, Rally and drawing
Hobbies:Basketball, video games and drawing

Future projects: Advanced agentic AI systems, multi-agent architectures, and cutting-edge LLM applications

Instructions:
- Always be friendly, professional, and concise
- Answer questions about Victor's background, skills, projects, and experience
- You can speak both French and English
- Keep responses SHORT and focused (2-3 sentences maximum per section)
- Use clear formatting: bullet points, short paragraphs, no excessive detail
- If asked about projects, briefly mention them and suggest visiting /works for details
- Never make up information that isn't provided here
- When listing items, keep them brief and use commas instead of detailed explanations"""

# Routes publiques (pour le frontend)
@app.get("/api/projects")
async def get_projects():
    """Récupère tous les projets"""
    projects = load_projects()
    return {"projects": projects}

@app.get("/api/projects/{project_id}")
async def get_project(project_id: int):
    """Récupère un projet spécifique"""
    projects = load_projects()
    project = next((p for p in projects if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Endpoint chatbot sécurisé (clé OpenAI côté backend)"""
    if not openai_client:
        raise HTTPException(
            status_code=503, 
            detail="OpenAI service not available. Please configure OPENAI_API_KEY."
        )
    
    try:
        # Construire les messages pour OpenAI
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
        
        # Ajouter l'historique
        for msg in request.history:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # Ajouter le nouveau message
        messages.append({"role": "user", "content": request.message})
        
        # Appel à OpenAI
        completion = openai_client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=messages,
            max_tokens=500,  # Augmenté pour éviter les coupures
            temperature=0.5,  # Réduit pour des réponses plus cohérentes et concises
        )
        
        response_text = completion.choices[0].message.content
        return {"response": response_text}
        
    except Exception as e:
        print(f"Error calling OpenAI: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get AI response: {str(e)}"
        )

# Routes admin (sécurisées)
@app.post("/api/admin/projects", dependencies=[Depends(verify_api_key)])
async def create_project(project: ProjectCreate):
    """Crée un nouveau projet"""
    projects = load_projects()
    
    # Générer un nouvel ID
    new_id = max([p["id"] for p in projects], default=0) + 1
    
    new_project = {
        "id": new_id,
        **project.dict()
    }
    
    projects.append(new_project)
    
    if not save_projects(projects):
        raise HTTPException(status_code=500, detail="Failed to save project")
    
    return {"message": "Project created successfully", "project": new_project}

@app.put("/api/admin/projects/{project_id}", dependencies=[Depends(verify_api_key)])
async def update_project(project_id: int, project_update: ProjectUpdate):
    """Met à jour un projet"""
    projects = load_projects()
    
    project_index = next((i for i, p in enumerate(projects) if p["id"] == project_id), None)
    if project_index is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Mettre à jour uniquement les champs fournis
    update_data = project_update.dict(exclude_unset=True)
    projects[project_index].update(update_data)
    
    if not save_projects(projects):
        raise HTTPException(status_code=500, detail="Failed to update project")
    
    return {"message": "Project updated successfully", "project": projects[project_index]}

@app.delete("/api/admin/projects/{project_id}", dependencies=[Depends(verify_api_key)])
async def delete_project(project_id: int):
    """Supprime un projet"""
    projects = load_projects()
    
    project_index = next((i for i, p in enumerate(projects) if p["id"] == project_id), None)
    if project_index is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    deleted_project = projects.pop(project_index)
    
    if not save_projects(projects):
        raise HTTPException(status_code=500, detail="Failed to delete project")
    
    return {"message": "Project deleted successfully"}

@app.post("/api/admin/upload", dependencies=[Depends(verify_api_key)])
async def upload_file(file: UploadFile = File(...)):
    """Upload un fichier (image)"""
    # Limite de taille : 10MB
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    
    # Valider le type de fichier
    allowed_extensions = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"File type {file_ext} not allowed")
    
    # Lire et vérifier la taille du fichier
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413, 
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE / (1024 * 1024):.1f}MB"
        )
    
    # Générer un nom de fichier unique
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    random_str = secrets.token_hex(4)
    new_filename = f"{timestamp}_{random_str}{file_ext}"
    file_path = UPLOADS_DIR / new_filename
    
    # Sauvegarder le fichier
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(contents)
        
        return {
            "message": "File uploaded successfully",
            "filename": new_filename,
            "path": f"uploads/{new_filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

@app.get("/health")
async def health_check():
    """Vérification de l'état de l'API"""
    return {"status": "ok", "message": "API is running"}


@app.get("/cron/ping")
async def cron_ping():
    """Endpoint simple pour les vérifications CRON"""
    return {
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

