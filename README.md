# Createverse AI App

## 🚀 Overview
The **Createverse** platform is a full-stack AI-powered application designed to streamline digital media creation and document processing[cite: 7]. It integrates cutting-edge models via the **Hugging Face API** (`FLUX.1-schnell`) and **Remove.bg API** to automate branding, media manipulation, and background removal[cite: 7].

---

### ✨ Key Features
- **Hugging Face AI Integration:** Leverages state-of-the-art machine learning models for advanced media and image generation tasks[cite: 7].
- **Generative AI Image & Icon Generation:** Automated logo, icon, and image creation using advanced vision models[cite: 7].
- **Background Removal Pipeline:** Low-latency image processing pipelines powered by Remove.bg to handle user media extraction efficiently[cite: 7].
- **Background Generator:** Tailored scene and wallpaper generation using targeted text prompts.
- **PDF Document Synthesis:** Dynamic generation and processing of document reports directly within the app[cite: 7].
- **Full-Stack Architecture:** Seamless integration between responsive frontend interfaces, local proxy backend services, and production serverless endpoints[cite: 7].

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Bootstrap, CSS3
* **Backend:** Node.js, Express.js (Local development)
* **Production Deployment:** Native Vercel Serverless Functions (`/api` routes)
* **APIs & Models:**
  * Hugging Face Inference (`black-forest-labs/FLUX.1-schnell`)
  * Remove.bg API

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following keys:

```env
HUGGING_FACE_TOKEN=your_hugging_face_token_here
REMOVE_BACKGROUND_API_KEY=your_remove_bg_api_key_here
```

---

## 📦 Project Structure

```text
createverse-ai-app/
├── api/                        # Production Vercel Serverless Functions
│   ├── generate-image.js
│   └── remove-bg.js
├── public/
├── src/
│   ├── components/
│   │   ├── BackgroundGenerator.jsx
│   │   ├── BackgroundRemover.jsx
│   │   ├── IconGenerator.jsx
│   │   ├── ImageGenerator.jsx
│   │   ├── PdfGenerator.jsx
│   │   ├── Home.jsx
│   │   ├── Navbar.jsx
│   │   └── Spinner.jsx
│   ├── App.jsx
│   └── main.jsx
├── server.js                   # Express server for local development
├── vite.config.js              # Vite configuration & proxy setup
└── package.json
```

---

## 💻 Local Development Setup

### 1. Prerequisites
Ensure you have **Node.js** installed on your system.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Express Backend Server
Start the Express backend on port `5000`:
```bash
node server.js
```

### 4. Run Vite Frontend
In a separate terminal, start the Vite development server on port `3000`:
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🌐 Deployment on Vercel

1. Push your code to your **GitHub** repository.
2. Import the repository in **Vercel** (`Root Directory: ./` and `Framework Preset: Vite`).
3. Set your **Environment Variables** (`HUGGING_FACE_TOKEN` and `REMOVE_BACKGROUND_API_KEY`).
4. Click **Deploy**. Vercel will build the React application and automatically deploy native serverless functions in the `/api` directory.

---

## 👨‍💻 Author

**Muhammad Anas**  
*Backend & Full-Stack Software Developer*
