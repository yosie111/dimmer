# Dimmer - Lead Generation & Product Management System

A full-stack MERN application for managing dimmer switch products and capturing leads.

## Features

- 🏠 Landing page with lead capture form
- 📦 Product management with image upload
- ☁️ Cloudinary integration for images
- 🔍 Filtering and search capabilities
- 📱 Responsive design (RTL Hebrew support)

## Tech Stack

- **Frontend:** React, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Images:** Cloudinary
- **Testing:** Jest, React Testing Library

## Project Structure

dimmer
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LeadsManager.jsx
│   │   │   └── ProductManager.jsx
│   │   ├── pages
│   │   │   └── LandingPage
│   │   │       ├── components
│   │   │       ├── hooks
│   │   │       ├── LandingPage.jsx
│   │   │       └── index.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server
│   ├── config
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── models
│   │   ├── Lead.js
│   │   └── Product.js
│   ├── tests
│   ├── server.js
│   └── package.json
└── README.md


## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- Cloudinary account

### Backend Setup
```bash
cd server
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/dbname
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

Seed database (optional):
```bash
npm run seed
```

Start server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## API Endpoints

╔════════════════════════════════════════════════════════════╗
║                                                            ║
                                                                                                                ║   🚀 השרת פועל על פורט ${PORT}                              ║
║   📦 MongoDB מחובר                                        ║
║   ☁️  Cloudinary מוגדר                                      ║
║                                                            ║
║   Root Endpoint:                                          ║
║   GET    /                        - כל הלידים וכל המוצרים   ║
║                                                            ║
║   Leads Endpoints:                                         ║
║   POST   /api/leads              - הוספת ליד               ║
║   GET    /api/leads              - כל הלידים (נוסף: Date)  ║
║   GET    /api/leads/:id          - ליד בודד                ║
║   PATCH  /api/leads/:id          - עדכון ליד               ║
║   DELETE /api/leads/:id          - מחיקת ליד               ║
║                                                            ║
║   Products Endpoints:                                      ║
║   GET    /api/products           - כל המוצרים              ║
║   GET    /api/products/:id       - מוצר בודד               ║
║   POST   /api/products           - הוספת מוצר (עם תמונה)   ║
║   POST   /api/products/bulk      - הוספת רשימת מוצרים      ║
║   PATCH  /api/products/:id       - עדכון מוצר (עם תמונה)   ║
║   DELETE /api/products/:id       - מחיקת מוצר              ║
║                                                            ║
║   Image Endpoints:                                         ║
║   POST   /api/products/:id/image - העלאת תמונה למוצר       ║
║   DELETE /api/products/:id/image - מחיקת תמונה ממוצר       ║
║                                                            ║
║   GET    /api/health             - בדיקת תקינות            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

### Query Parameters
- Products: `?model=mark1&color=white&positions=2&inStock=true`
- Leads: `?status=new&source=website`

## URLs

| URL | Description |
|-----|-------------|
frontend
| https://dimmer-frontend.onrender.com/ | Landing page |
| https://dimmer-frontend.onrender.com/admin | Product management |
| https://dimmer-frontend.onrender.com/dashboard | Leads dashboard |
| https://dimmer-frontend.onrender.com/leads | Leads management |
server
| https://dimmer.onrender.com/api/health | API health check |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port https://dimmer.onrender.com  (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## License

ISC
