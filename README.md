# Dimmer – Lead Generation & Product Management System

A full-stack **MERN** application for managing smart dimmer switch products and capturing customer leads.  
Designed with a clean admin experience, a robust REST API, and production-ready deployment on Render.

---

## ✨ Features

- 🌐 Public landing page with lead capture form  
- 🧑‍💼 Admin dashboard for lead management  
- 📦 Product management with image upload (Cloudinary)  
- 🔍 Filtering, search, sorting, and date range queries  
- 📊 Lead statistics and conversion insights  
- 📱 Responsive design with RTL (Hebrew) support  
- ☁️ Deployed to Render (frontend & backend)

---

## 🛠 Tech Stack

### Frontend
- React 18
- React Router
- RTL-friendly responsive UI

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

### Infrastructure & Tools
- Cloudinary (image storage)
- Render (deployment)
- Jest & React Testing Library

---

## 📁 Project Structure

```
dimmer/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Dashboard.jsx
│       │   ├── LeadsManager.jsx
│       │   └── ProductManager.jsx
│       ├── pages/
│       │   └── LandingPage/
│       │       ├── components/
│       │       └── hooks/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── models/
│   │   ├── Lead.js
│   │   └── Product.js
│   ├── tests/
│   └── server.js
│
├── package.json
└── README.md
```

---

## 🚀 Live URLs

### Frontend
| URL | Description |
|-----|-------------|
| https://dimmer-frontend.onrender.com/ | Landing page |
| https://dimmer-frontend.onrender.com/admin | Product management |
| https://dimmer-frontend.onrender.com/dashboard | Leads dashboard |
| https://dimmer-frontend.onrender.com/leads | Leads management |

### Backend
| URL | Description |
|-----|-------------|
| https://dimmer.onrender.com/api/health | API health check |

---

## 🔌 API Endpoints

### Root
| Method | Endpoint | Description |
|------|---------|-------------|
| GET | `/` | Get all leads and all products |

### Leads
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/leads` | Create new lead |
| GET | `/api/leads` | Get all leads |
| GET | `/api/leads/:id` | Get single lead |
| PATCH | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |

### Products
| Method | Endpoint | Description |
|------|---------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product |
| POST | `/api/products/bulk` | Bulk create products |
| PATCH | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Product Images
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/products/:id/image` | Upload product image |
| DELETE | `/api/products/:id/image` | Delete product image |

---

## ⚙️ Installation

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

---

## 🔒 Security Notes

- Environment variables are not committed
- Passwords are hashed (bcrypt)
- Secrets stored securely

---

## 📄 License
ISC
