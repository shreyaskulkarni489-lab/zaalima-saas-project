# Zaalima SaaS Project

A full-stack SaaS application built with React (frontend) and Express.js (backend).

## Project Structure

```
zaalima-saas-project/
│
├── backend/          # Node.js + Express API
├── frontend/         # React application
└── README.md        # This file
```

## Getting Started

### Backend Setup
1. Navigate to `/backend`
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server (runs on port 5000)

### Frontend Setup
1. Navigate to `/frontend`
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server (runs on port 3000)

## API Documentation

- `GET /` - Returns a welcome message

## Technologies Used

- **Backend**: Node.js, Express, MongoDB (Mongoose), CORS
- **Frontend**: React, Tailwind CSS
- **Development**: Nodemon, Vite (optional)

## Environment Variables

Create a `.env` file in `/backend` with:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```
