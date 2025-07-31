# SkillShare 

A modern micro skill-sharing platform built with React and Firebase.

---

##  Overview
SkillShare is a web app where anyone can create, join, and discover live micro-skill sessions. Whether you want to teach, learn, or just explore new skills, SkillShare makes it easy and beautiful.

---

##  Features
- **Landing Page:** Modern, responsive, and inviting.
- **Authentication:** Google sign-in with Firebase Auth.
- **Personalized Home:** Greeted by your username, search/filter sessions, and see your dashboard.
- **Session Management:**
  - Create, edit, and delete sessions (title, description, category, date/time, difficulty, tags).
  - Join and leave sessions.
  - See all sessions, your sessions, joined, and upcoming.
- **AI Tag Suggestions:** Suggest relevant tags for your session using Google Gemini AI.
- **Responsive Design:** Mobile-first, beautiful gradients, and elegant cards.

---

## 🛠 Tech Stack
- **Frontend:** React (with hooks), React Router DOM
- **Backend:** Firebase (Firestore & Auth)
- **AI Integration:** Google Gemini API (via REST)
- **Styling:** Custom CSS (no Tailwind/MUI)

---

##  Getting Started

### 1. **Clone the repository**
```bash
git clone https://github.com/your-username/skillshare.git
cd skillshare
```

### 2. **Install dependencies**
```bash
npm install
```

### 3. **Set up Firebase**
- Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
- Enable **Authentication** (Google sign-in)
- Create a **Firestore** database
- In your project, create `src/config/firebase.js`:

```js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  // ...other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleprovider = new GoogleAuthProvider();
export const database = getFirestore(app);
```

### 4. **Set up Gemini API**
- Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Add it to your `.env` file:
```
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### 5. **Run the app**
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure
```
src/
  components/
    ProtectedRoute.jsx
    SessionCard.jsx
  pages/
    landing.jsx
    signin.jsx
    home.jsx
    CreateSession.jsx
    EditSession.jsx
    SessionDetail.jsx
  utils/
    geminiSuggestTags.js
  config/
    firebase.js
  ...
```

---

##  AI Tag Suggestion
- When creating or editing a session, click **"Suggest Tags with AI"** below the tags field.
- The app will use Gemini to suggest relevant tags based on your title and description.

---

##  About This Project
SkillShare was built to make learning and teaching micro-skills accessible, social, and fun. The UI is designed to be clean, modern, and inviting, with a focus on usability and mobile-friendliness. AI integration makes it even easier for users to create high-quality sessions.

---

##  Credits
- UI/UX: Custom CSS, inspired by modern web design
- AI: Google Gemini API
- Auth & DB: Firebase

---

## 📬 Feedback & Contributions
Pull requests and issues are welcome! If you have ideas or want to contribute, feel free to open an issue or PR.

---

**Happy sharing and learning!** 🚀
