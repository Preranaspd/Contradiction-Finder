# 🤖 Contradiction Finder AI Agent

AI-powered debate analyzer generating Pro/Con viewpoints across 4 perspectives (Scientific, Economic, Ethical, General) with contradiction analysis.

---

## 🏗️ Tech Stack

- **Backend:** Flask + LangChain LCEL (v0.3)
- **AI:** Gemma-3-12b-it (Google AI Studio)
- **Frontend:** HTML/CSS/JavaScript
- **Deployment:** Python run.py

---

## 🚀 Features

- 🔄 Pro/Con Viewpoints - Opposing arguments for any topic  
- 🧠 4 Perspectives - Scientific, Economic, Ethical, General analysis  
- ⚖️ Contradiction Detection - Identifies core conflicts  
- ❓ Uncertainty Analysis - Highlights evidence gaps  
- 🎨 Responsive UI - Clean, modern interface  

---

## 📁 Installation & Setup

### Prerequisites
- Python 3.10+
- GitHub account

### 1. Clone Repository
```bash
git clone https://github.com/Preranaspd/Contradiction-Finder.git
cd Contradiction-Finder
```
### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Get Free Gemma AI Key
- Go to Google AI Studio  
- Click "Create API key" and copy it  

### 4. Configure Environment
```bash
echo "GOOGLE_API_KEY=your_actual_api_key_here" > .env
```

### 5. Run Application
```bash
python run.py
```

## 📊 Quick Demo Flow

1. Enter topic: "CRISPR intelligence enhancement"
2. View Pro/Con arguments
3. Switch perspectives (Scientific/Economic/Ethical/General)
4. Read contradiction + uncertainty analysis

---

## 📁 Project Structure

```
contradiction-agent/
├── app/
│   ├── __init__.py     # Flask factory
│   ├── routes.py       # API endpoints
│   └── ai_engine.py    # LangChain + Gemma AI
├── templates/
│   └── index.html      # Main UI
├── static/
│   ├── css/styles.css
│   └── js/main.js
├── .env                # API key
├── requirements.txt
└── run.py
```
