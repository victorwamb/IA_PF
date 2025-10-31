# 🚀 Backend API - Portfolio Admin

API FastAPI pour la gestion des projets du portfolio.

## 🎯 Fonctionnalités

- ✅ CRUD complet des projets
- ✅ Upload d'images
- ✅ Sécurisation par Bearer token
- ✅ CORS configuré pour React
- ✅ Endpoints publics pour la lecture
- ✅ Endpoints admin sécurisés pour la modification

## 📦 Installation

```bash
# Installer les dépendances
pip install fastapi uvicorn python-dotenv

# Ou installer toutes les dépendances du projet
pip install -r ../requirements.txt
```

## 🔧 Configuration

Créez un fichier `.env` dans le dossier `backend/` :

```bash
ADMIN_API_KEY=votre_cle_secrete_tres_longue_et_aleatoire
```

## 🚀 Démarrage

```bash
# Méthode 1 : Directement
python main.py

# Méthode 2 : Avec uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

L'API sera accessible sur : **http://localhost:8000**

## 📚 Documentation API

Une fois l'API démarrée, consultez la documentation interactive :
- **Swagger UI** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc

## 🔌 Endpoints

### Public (lecture)

- `GET /api/projects` : Liste tous les projets
- `GET /api/projects/{id}` : Détails d'un projet
- `GET /health` : État de l'API

### Admin (modification) - Bearer token requis

- `POST /api/admin/projects` : Créer un projet
- `PUT /api/admin/projects/{id}` : Modifier un projet
- `DELETE /api/admin/projects/{id}` : Supprimer un projet
- `POST /api/admin/upload` : Upload une image

### Exemple de requête admin

```bash
# Avec curl
curl -X POST http://localhost:8000/api/admin/projects \
  -H "Authorization: Bearer admin2025_secret_key_change_me" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon Projet",
    "titleSimple": "#07",
    "description": "Description...",
    "technologies": ["React", "Node.js"],
    "date": "2025",
    "categorie": ["Web Development"],
    "image": "project7/img1.png",
    "imageSimple": "project7/img1.png",
    "type": "Web Development",
    "vue": "https://example.com"
  }'
```

## 🌐 Déploiement

### Railway / Render / Heroku

1. Créez un compte sur Railway/Render/Heroku
2. Connectez votre repository GitHub
3. Configurez les variables d'environnement :
   - `ADMIN_API_KEY`
4. Déployez !

### Variables d'environnement requises

- `ADMIN_API_KEY` : Clé secrète pour l'authentification admin (générez une clé aléatoire !)

## 🔐 Sécurité

⚠️ **IMPORTANT** : Changez la clé API en production !

**Générer une clé sécurisée** :
```python
import secrets
print(secrets.token_urlsafe(32))
```

**Configuration CORS** :
Editez `main.py` ligne 22 pour ajouter votre domaine :
```python
allow_origins=["http://localhost:3000", "https://votre-domaine.com"],
```

## 🐛 Troubleshooting

### Port déjà utilisé

```bash
# Changer le port dans main.py ou uvicorn
uvicorn main:app --port 8001
```

### Erreur CORS

Vérifiez que votre domaine frontend est dans la liste `allow_origins`.

### Fichier projects.json introuvable

L'API recherche le fichier dans `src/data/projects.json` depuis la racine du projet. 
Assurez-vous de lancer l'API depuis le dossier `backend/` ou ajustez les chemins.

## 📝 Structure des Données

### Projet

```json
{
  "id": 1,
  "title": "Fairval - Legal AI with RAG",
  "titleSimple": "#01",
  "description": "Développement complet d'une IA juridique...",
  "description2": "Création d'une IA juridique autonome...",
  "description3": "Mise en place d'une pipeline complète...",
  "details": "Architecture RAG complète...",
  "technologies": ["Python", " - LLaMA 3", " - RAG", " - FAISS"],
  "date": "2025",
  "categorie": ["AI/ML", " - Backend", " - RAG Systems"],
  "image": "",
  "imageSimple": "project1/img1.png",
  "images": ["project1/img1.png", "project1/img4.jpeg", "project1/ia.png"],
  "type": "AI/ML Development",
  "vue": "https://fairval.com"
}
```

## 🚀 Améliorations Futures

- [ ] Base de données PostgreSQL/MySQL
- [ ] Authentification JWT avancée
- [ ] Rate limiting
- [ ] Logs et monitoring
- [ ] Cache Redis
- [ ] Webhooks pour notifications
- [ ] Versioning des projets

