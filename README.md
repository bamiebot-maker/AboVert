# AboVert 🌿

**AI-Powered Plant Disease Detection for Farmers & Gardeners**

AboVert is a professional, mobile-first web application that helps users diagnose plant diseases instantly using AI. Built with a "neon cyber-green" aesthetic and focused on speed and simplicity.

🔗 **Live Demo:** [https://abovert-app.web.app](https://abovert-app.web.app)

![AboVert App](https://abovert-app.web.app/icon.png)

## ✨ Features

- **🤖 Real AI Detection**: Powered by Google's **Gemini 2.0 Flash** model for accurate diagnosis of 14+ plant diseases.
- **📱 Mobile-First Design**: Floating bottom navigation, touch-friendly interface, and responsive layout that feels like a native app.
- **⚡ Single Page Application (SPA)**: Smooth transitions between Home, Scan, Library, History, and Settings without page reloads.
- **📂 Local History**: Saves scan results globally to your device (`localStorage`) for quick reference.
- **📚 Disease Library**: Built-in database of common crop diseases with symptoms, treatment, and prevention info.
- **🔒 Privacy Focused**: No backend server tracking your user data; everything runs client-side or via secure API calls.

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **AI Model**: Google Gemini 2.0 Flash (via REST API)
- **Hosting**: Firebase Hosting
- **Architecture**: Client-side SPA with hash-based routing/state management

## 🚀 Getting Started

### Prerequisites
- Node.js & npm (for Firebase tools)
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bamiebot-maker/AboVert.git
   cd AboVert
   ```

2. **Serve locally**
   You can use any static file server.
   ```bash
   npx serve .
   ```

3. **Configure API Key**
   - Open the app in your browser
   - Go to **Settings**
   - Enter your Gemini API Key (saved locally to your browser)

## 📦 Deployment

Hosted on Firebase:

1. **Install Firebase Tools**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login & Init**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Deploy**
   ```bash
   firebase deploy
   ```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
*Built with 💚 by AboVert Team*
