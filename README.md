# CodeSense AI 🚀

**AI-Powered Code Review & Optimization Platform**

CodeSense AI is a modern SaaS platform that helps developers write better code faster. It uses advanced LLMs (via Groq) to provide automated code reviews, detect bugs, identify security vulnerabilities, and suggest performance optimizations in real-time.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- **🤖 AI Automated Analysis:** Instant feedback on code quality and logic.
- **🐛 Bug Detection:** Catches potential runtime errors and logic flaws.
- **🛡️ Security Scanning:** Identifies vulnerabilities like SQL injection and XSS.
- **⚡ Performance Tuning:** Suggests optimizations to speed up execution.
- **📝 Repository Documentation:** Generates comprehensive documentation for entire GitHub repositories.
- **📊 Dashboard History:** Track and revisit past analyses with detailed insights.
- **🎨 Modern UI:** Built with Next.js, Tailwind CSS, and Framer Motion for a seamless dark/light mode experience.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** Tailwind CSS, Shadcn UI
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Auth:** Supabase Auth

### Backend
- **Runtime:** Python 3.9+
- **Framework:** FastAPI
- **AI Engine:** Groq API (Llama 3 models)
- **Database:** Supabase (PostgreSQL)
- **Integrations:** PyGithub

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.9 or higher)
- [Git](https://git-scm.com/)

## 🚀 Installation & Setup

Follow these steps to get the project running locally.

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/codesense-ai.git](https://github.com/your-username/codesense-ai.git)
cd codesense-ai
```

2. Backend Setup (⚠️ Important)
To ensure the backend runs correctly, you must organize the Python files.

Create a folder named backend in the root directory.

Move the following files into the backend/ folder:

main.py

models.py

services.py

github_service.py

requirements.txt (Create this file if it doesn't exist, see below)

Navigate to the backend folder and install dependencies:
```
Bash
cd backend
python -m venv venv
```
```
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

# Install required packages
pip install fastapi uvicorn groq python-dotenv pydantic supabase PyGithub
Configure Environment Variables: Create a .env file inside the backend folder:

Code snippet
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key  # Use Service Role key for backend
Start the Backend Server:

Bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
The backend should now be running at http://localhost:8000.

3. Frontend Setup
Open a new terminal and navigate to the project root (where package.json is located).

Install Dependencies:
```
Bash
npm install
# or
yarn install
```
Configure Environment Variables: Create a .env.local file in the root directory:
```
Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000  # Points to your local python backend
```
Start the Frontend:
```
npm run dev
The frontend should now be accessible at http://localhost:3000.
```
```
📂 Project Structure
Plaintext
codesense-ai/
├── app/                  # Next.js App Router pages
│   ├── dashboard/        # Dashboard, History, Settings
│   ├── login/            # Authentication pages
│   └── page.tsx          # Landing page
├── components/           # React components (UI, Layouts)
├── backend/              # 🐍 Python Backend (FastAPI)
│   ├── main.py           # API Endpoints
│   ├── services.py       # Supabase logic
│   ├── models.py         # Pydantic data models
│   └── github_service.py # GitHub API handler
├── lib/                  # Utility functions
└── public/               # Static assets
```
Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request
