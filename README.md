# Dimmer – Lead Generation & Product Management System

A full-stack **MERN** application for managing smart dimmer switch products and capturing customer leads.  
Built with a clean admin experience, a robust REST API, and production-ready deployment on Render.

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

dimmer/
├── frontend/
│ ├── public/
│ └── src/
│ ├── components/
│ │ ├── Dashboard.jsx
│ │ ├── LeadsManager.jsx
│ │ └── ProductManager.jsx
│ ├── pages/
│ │ └── LandingPage/
│ │ ├── components/
│ │ └── hooks/
│ ├── App.jsx
│ └── main.jsx
│
├── server/
│ ├── config/
│ │ ├── db.js
│ │ └── cloudinary.js
│ ├── models/
│ │ ├── Lead.js
│ │ └── Product.js
│ ├── tests/
│ └── server.js
│
├── package.json
└── README.md


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

---

### Leads
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/leads` | Create new lead |
| GET | `/api/leads` | Get all leads (filters & pagination optional) |
| GET | `/api/leads/:id` | Get single lead |
| PATCH | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |

---

### Products
| Method | Endpoint | Description |
|------|---------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (with image) |
| POST | `/api/products/bulk` | Bulk create products |
| PATCH | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

---

### Product Images
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/products/:id/image` | Upload product image |
| DELETE | `/api/products/:id/image` | Delete product image |

---

### Health
| Method | Endpoint | Description |
|------|---------|-------------|
| GET | `/api/health` | API health check |

---

## ⚙️ Installation

### Prerequisites
- Node.js 18+
- MongoDB
- Cloudinary account

---

### Backend Setup

```bash
cd server
npm install


PORT=<MyServer>
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dimmer
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development

Start the server:   npm run dev

Frontend Setup:
cd frontend
npm install
npm start

Create .env file:
REACT_APP_API_URL=https://dimmer.onrender.com

Run tests with coverage:
npm run test:coverage

🖼 Screenshots / Demo
docs/screenshots/dashboard.png
docs/screenshots/leads.gif


Example usage:
![Dashboard](docs/screenshots/dashboard.png)
