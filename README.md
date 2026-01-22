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
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dimmer_db
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

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/leads` | Create lead |
| GET | `/api/leads` | Get all leads |
| GET | `/api/leads/:id` | Get single lead |
| PATCH | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (with image) |
| PATCH | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| POST | `/api/products/:id/image` | Upload image |
| DELETE | `/api/products/:id/image` | Delete image |

### Query Parameters
- Products: `?model=mark1&color=white&positions=2&inStock=true`
- Leads: `?status=new&source=website`

## URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000/` | Landing page |
| `http://localhost:3000/admin` | Product management |
| `http://localhost:5000/api/health` | API health check |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## License

ISC