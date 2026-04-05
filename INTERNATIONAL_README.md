# 🔍 Credibility Check - Professional Fact Verification Platform

A professional, international-level AI-powered fact verification platform built with React and Flask. Detect misinformation, verify credibility scores, and analyze content in multiple languages.

## ✨ Features

### 🌍 International & Multi-Language Support
- **4 Languages**: English, Spanish (Español), French (Français), German (Deutsch)
- Language selection persisted in localStorage
- Professional translations for all UI elements
- Accessible language selector in header

### 🌙 Theme Support
- Dark Mode & Light Mode toggle
- Professional color schemes for both themes
- Smooth theme transitions
- Theme preference saved in localStorage
- GitHub-style dark theme for professional look

### 📊 Analysis Features
- Real-time AI-powered credibility scoring
- Content analysis with suspicious sentence detection
- Source reliability verification
- Fact-checking resource recommendations
- Progress visualization with color-coded scores
- Detailed analysis reports

### 📋 User Features
- User authentication (Sign In/Login)
- Analysis history tracking (20 most recent)
- Guest mode for anonymous analysis
- Copy results to clipboard
- Export analysis as JSON
- Clear history functionality

### 🎨 Professional UI/UX
- Clean, modern interface
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Accessibility-first design
- Professional typography and spacing
- Color-coded credibility indicators
- Loading spinners and UI feedback
- Toast-like error messages

### ♿ Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Semantic HTML structure
- Spellcheck support on textarea
- Print-optimized styles

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ and npm
- Python 3.8+
- MongoDB (optional, for user history)

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on `http://localhost:5000`

## 📚 Project Structure

```
fake-news-ai/
├── frontend/
│   ├── src/
│   │   ├── App.js              # Main app with i18n support
│   │   ├── App.css             # Professional styling
│   │   ├── i18n.js             # Multi-language translations
│   │   └── components/
│   │       └── LoginModal.js
│   └── package.json
├── backend/
│   ├── app.py                  # Flask API server
│   ├── auth.py                 # Authentication logic
│   ├── utils.py                # Analysis utilities
│   └── requirements.txt
└── README.md
```

## 🔌 API Endpoints

### Guest Analysis
```bash
POST /analyze_guest
Content-Type: application/json
Body: {"input": "text or URL"}
```

### Authenticated Analysis
```bash
POST /analyze
Content-Type: application/json
Header: Authorization: Bearer <token>
Body: {"input": "text or URL"}
```

### User Management
```bash
POST /login
POST /register
POST /history
DELETE /history/<id>
```

## 🛠 Technologies Used

### Frontend
- React 18+
- CSS3 with CSS Variables
- localStorage API
- Fetch API for HTTP requests

### Backend
- Flask
- Flask-JWT for authentication
- Transformers (Hugging Face) for NLP
- PyMongo for database
- BeautifulSoup for web scraping

## 🎯 Color Themes

### Light Mode
- Primary Background: #f8f9fa
- Secondary Background: #ffffff
- Text: #1a1a1a
- Accent: #2563eb

### Dark Mode
- Primary Background: #0f1117
- Secondary Background: #161b22
- Text: #e6edf3
- Accent: #58a6ff

## 📈 Analysis Scoring

- **80-100**: Highly Credible ✅
- **60-79**: Likely Credible ✅
- **40-59**: Suspicious ⚠️
- **0-39**: Likely Fake ❌

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- CORS enabled
- Input validation
- Database connection security

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: 480px - 767px
- Small Mobile: < 480px

## 🌐 Internationalization

All UI text is managed through the `i18n.js` file:
- Easy to add new languages
- Centralized translation management
- Full coverage of all UI strings
- Professional translations

## 📊 Features Roadmap

- [ ] More language support (Chinese, Arabic, etc.)
- [ ] Advanced analytics dashboard
- [ ] Bulk analysis API
- [ ] Browser extensions
- [ ] Mobile app
- [ ] Real-time collaboration features
- [ ] Advanced reporting

## 📝 License

MIT License - feel free to use for educational and commercial purposes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for global accuracy**
