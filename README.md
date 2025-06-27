# 🛍️ Bazaar – AI-Powered Cross-Platform Marketplace

**Bazaar** is a full-stack e-commerce platform built for both **web** and **mobile** users. It provides a seamless shopping experience, with real-time AI chat support, secure payment processing, automated product imagery, and smooth user authentication.

This project was created to demonstrate modern best practices in full-stack app development, including CI/CD, secure RESTful APIs, JWT authentication, React Native + Web UI/UX, and OpenAI integration.

---

## 🚀 Features

- 🧠 **AI Chatbot Support** powered by OpenAI
- 📱 **React Native** mobile app (Expo)
- 🌐 **React Web App** (Vite/Next.js)
- 🛒 Product listing with auto-fetched images from **Unsplash API**
- 💳 Payments via **Stripe** (Visa, Debit, Credit, Apple Pay)
- 🔐 JWT-based user authentication
- ✨ UX-first design (mobile + responsive web)
- 🧪 Unit testing (Jest) and CI/CD pipeline (GitHub Actions)
- 🔁 Agile development process with feature-based commits

---

## 🧰 Tech Stack

### Frontend
- React Native (Expo)
- React (Vite or Next.js)
- React Navigation / React Router
- Zustand / Redux Toolkit
- Formik + Yup

### Backend
- Node.js + Express
- MongoDB (Atlas) or Firestore
- JWT Authentication
- Stripe API
- OpenAI API
- Unsplash API (image fetch)

### DevOps
- GitHub Actions
- Expo EAS (mobile build/deploy)
- Netlify / Vercel (web hosting)
- ESLint + Prettier + Jest

---

## 🗂️ Project Structure

```plaintext
bazaar/
├── client-mobile/       # React Native app (Expo)
├── client-web/          # Web app (React)
├── backend/             # Node.js/Express API
├── shared/              # (optional) shared logic or types
└── .env                 # API keys and secrets
