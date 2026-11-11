# 📝 Todo App

A modern and responsive **task management and productivity application** built with **React.js and TypeScript**. Todo helps users organize daily tasks, manage priorities, plan study sessions, and stay focused with built-in productivity tools.

🔗 **Live Demo:** https://todo-app-two-sigma-85.vercel.app/

---

## ✨ Overview

**Todo App** is designed to make everyday task and study management simple and organized.

Users can create, edit, complete, and delete tasks while managing priorities and schedules. The application also provides dedicated views for daily, weekly, and monthly planning.

For students, Todo includes a **Study Planner** and **Pomodoro Timer** to help organize study goals and maintain focused work sessions. The Pomodoro timer keeps running when you switch between screens.

The project is currently a website. An installable app version is planned for the future.

---

## 🚀 Features

### 📋 Task Management
- Create tasks with title, date, time, and priority
- Edit existing tasks
- Mark tasks as completed
- Delete tasks
- Move deleted tasks to Trash
- Mark tasks as important
- Set task priority:
  - 🟢 Low
  - 🟡 Medium
  - 🔴 High

### 📅 Task Views
- 🏠 Dashboard / Home
- 📌 Today's tasks
- 📆 Weekly task view
- 🗓️ Monthly task view

### 📚 Study & Productivity
- Study planner
- Create study goals and chapters
- Pomodoro timer for focused sessions
- Keep the timer running while navigating to other screens
- Organize study activities alongside regular tasks

### 🎨 User Experience
- 🌙 Dark mode
- ☀️ Light mode
- 🌌 Galaxy theme
- 🖱️ Default, Arc, Celebration, and Gyroscope cursor effects
- 👤 Profile name and selectable profile pictures
- 🔔 Optional task reminder notifications and sound while the website is open
- 📱 Responsive design
- 💾 Tasks and preferences saved in Browser Local Storage
- ⚡ Fast and modern React interface

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | React.js |
| Programming Language | TypeScript |
| Styling | Tailwind CSS |
| Build Tool | Vite |
| Data Storage | Browser Local Storage |
| Version Control | Git & GitHub |
| Deployment | Vercel |

---

## 📸 Screenshot

<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/f83fd729-498d-4dd4-a102-8ece3defc074"
    alt="Todo App home screen"
    width="100%"
  />
  <img
    src="https://github.com/user-attachments/assets/02eca418-c7d1-40ce-8936-28e6b220a3ca"
    alt="Todo App study timer screen"
    width="100%"
  />
  <img
    src="https://github.com/user-attachments/assets/f7a45548-fd16-407a-bcaf-e4572bd89fe7"
    alt="Todo App settings screen"
    width="100%"
  />
</p>

---

## 🌐 Live Demo

Try the application here:

👉 **https://todo-app-two-sigma-85.vercel.app/**

---

## 📂 Project Structure

```text
Todo App/
├── public/
│   ├── 1.jpg ... 8.jpg
│   ├── aniket.jpg
│   └── todo-logo.png
│
├── src/
│   ├── components/
│   │   ├── HomeView.tsx
│   │   ├── TodayView.tsx
│   │   ├── WeekView.tsx
│   │   ├── MonthView.tsx
│   │   ├── StudyView.tsx
│   │   ├── SettingsView.tsx
│   │   ├── CreateTaskModal.tsx
│   │   └── ...
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
│
├── public/
├── package.json
├── vite.config.ts
├── index.html
└── README.md
```

---

## ⚙️ Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/GxAniket/Todo-App.git
```

### 2. Navigate to the project directory

```bash
cd Todo-App
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at the local development URL shown in your terminal.

---

## 📦 Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 💾 Data Storage

Todo App uses the browser's **Local Storage API** to persist task and application data.

This means tasks remain available after refreshing or reopening the application in the same browser.

> Note: Data is stored locally in the user's browser and is not synchronized across different devices. Task reminders work while the website is open and require browser notification permission.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome!

Anyone is welcome to fork this repository, use it as a starting point, and make it their own.

If you have an idea that can improve **Todo App**, you can:

- ⭐ Star the repository
- 🍴 Fork the repository
- 🐛 Open an issue
- 🔀 Create a pull request

---

## 🧠 Learning & Development

This project is part of my journey to improve my skills in:

- React.js
- TypeScript
- Tailwind CSS
- Frontend development
- Responsive web design
- Modern UI/UX
- State management
- Browser Local Storage
- Component-based architecture

Building Todo App helped me understand how to transform a productivity concept into a functional and responsive web application.

---

## 👨‍💻 Connect with Me

<p align="center">
  <a href="https://github.com/GxAniket">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  
  <a href="mailto:sundriyalaniket@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email">
  </a>
  
  <a href="https://www.linkedin.com/in/aniket-sundriyal">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>

  <a href="https://aniket-portfolio-react.vercel.app/">
    <img src="https://img.shields.io/badge/Portfolio-Visit-8b5cf6?style=for-the-badge" alt="Portfolio">
  </a>
</p>

---

<p align="center">
  ✨ <strong>Todo App — Plan. Focus. Complete.</strong> ✨
</p>
