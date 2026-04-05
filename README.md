# 🚀 Fake News Detection Assistant

> 🧠 AI-powered system to detect fake vs real news using Machine Learning & NLP

<p align="center">
  <img src="https://img.shields.io/badge/AI-Fake%20News%20Detection-blue?style=for-the-badge&logo=python"/>
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge"/>
</p>

---

## 🌟 Introduction

The **Fake News Detection Assistant** is an intelligent system that analyzes news articles and predicts whether they are **REAL 🟢 or FAKE 🔴** using Machine Learning techniques.

In today's digital world, misinformation spreads rapidly. This project helps combat fake news using **Natural Language Processing (NLP)** and classification models.

---


## 🏗️ Architecture

```
Frontend (React) → Backend (Flask + Transformers + Torch) → MongoDB (History)
                          ↓
                    newspaper3k (URL extract)
                    validators (URL check)
```


## 🎬 Demo

<p align="center">
  <img src="https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif" width="600"/>
</p>

---

## 📌 Table of Contents

* [✨ Features](#-features)
* [⚙️ Installation](#️-installation)
* [🚀 Usage](#-usage)
* [🧠 Models Used](#-models-used)
* [📂 Project Structure](#-project-structure)
* [⚙️ Configuration](#️-configuration)
* [📊 Example](#-example)
* [🐞 Troubleshooting](#-troubleshooting)
* [👨‍💻 Contributors](#-contributors)
* [📜 License](#-license)

---

## ✨ Features

✨ Data preprocessing & cleaning
🤖 Machine Learning-based classification
📊 Model evaluation & comparison
⚡ Fast real-time predictions
🌐 Interactive UI (Streamlit supported)
📈 Visual insights & results

---

## ⚙️ Installation

### 📥 Clone Repository

```bash
git clone https://github.com/y4sssh/Fake-News-Detection-Assistant.git
cd Fake-News-Detection-Assistant
```

### 📦 Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🚀 Usage

### ▶️ Run the App

```bash
streamlit run app.py
```

or

```bash
python app.py
```

### 🧪 How It Works

1. Enter a news headline or article
2. Model processes the text
3. Output prediction:

* 🟢 Real News
* 🔴 Fake News

---

## 🧠 Models Used

* 📌 Naive Bayes
* 🌲 Random Forest
* 🔍 TF-IDF Vectorization
* 🧬 LSTM (optional deep learning)

---

## 📂 Project Structure

```bash
Fake-News-Detection-Assistant/
│
├── app.py
├── model.pkl
├── vectorizer.pkl
├── requirements.txt
├── data/
├── notebooks/
└── README.md
```

---

## ⚙️ Configuration

You can customize:

* Model parameters (inside notebooks)
* Dataset location
* UI design in `app.py`

---

## 📊 Example

```text
Input:
"Breaking: Aliens have landed on Earth!"

Output:
🔴 Fake News
```

---

## 🐞 Troubleshooting

❗ Missing dependencies
→ Run: `pip install -r requirements.txt`

❗ Model file not found
→ Ensure `.pkl` files exist in root directory

❗ App not launching
→ Check Python version (>=3.8 recommended)

---

## 🎨 GitHub Stats

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=y4sssh&show_icons=true&theme=tokyonight"/>
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=y4sssh&theme=tokyonight"/>
</p>

---

## 👨‍💻 Contributors

* 👤 **Yash** (Project Owner)
* 💡 Contributions are welcome!

---

## 🤝 Contributing

```bash
1. Fork the repo
2. Clone your fork
3. Create a new branch
4. Make changes
5. Push and open a Pull Request
```

---

## 📜 License

This project is licensed under the **MIT License**

---

## 💡 Future Improvements

🚀 Add BERT / Transformer models
📡 Integrate real-time news APIs
🧠 Improve model accuracy
🌍 Deploy to cloud (AWS / GCP / Render)

---

## ⭐ Support

If you found this useful:

👉 Star ⭐ this repository
👉 Share with others

---

<h3 align="center">💬 "Fighting misinformation with AI!"</h3>


