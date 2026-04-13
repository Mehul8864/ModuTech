# Gadgetry

An e-commerce web app for browsing, listing, and buying gadgets. Built with React, Redux, Node.js, Express, MongoDB, Firebase Auth, and Stripe.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Redux Toolkit, React Router v6, Material UI, Axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB (local or Atlas) |
| Auth | Firebase Authentication |
| Payments | Stripe |
| Image Upload | Firebase Storage |

---

## Project Structure

```
ModuTech/
├── client/          # React frontend (port 3000)
│   ├── src/
│   │   ├── Components/
│   │   ├── actions/
│   │   ├── reducers/
│   │   ├── api/
│   │   ├── firebase.js
│   │   └── authSlice.js
│   └── .env         # Firebase config (see below)
└── server/          # Express backend (port 5001)
    ├── controllers/
    ├── models/
    ├── routes/
    └── .env         # MongoDB URI, Stripe key, etc.
```

---

## Prerequisites

- Node.js >= 18
- MongoDB installed locally **or** a MongoDB Atlas cluster
- A Firebase project with Authentication enabled
- (Optional) A Stripe account for payments

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ModuTech.git
cd ModuTech
```

### 2. Set up the backend

```bash
cd server
npm install
```

Edit `server/.env`:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/Gadgets
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
FIREBASE_STORAGE_BUCKET=gs://your-project.appspot.com
GOOGLE_SERVICE_ACCOUNT_PATH=./serviceAccount.json
```

Start the server:

```bash
node index.js
```

### 3. Set up the frontend

```bash
cd client
npm install
```

Create `client/.env` with your Firebase project config (find it in Firebase Console → Project Settings → Your apps):

```env
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123:web:abc123
```

Start the frontend:

```bash
npm start
```

### 4. Start MongoDB (if running locally)

```bash
mongod --dbpath "C:/data/db"
```

---

## API Endpoints

Base URL: `http://localhost:5001`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gadgets` | List all gadgets (supports `?page`, `?pageSize`, `?search`, `?category`) |
| GET | `/gadgets/:id` | Get a single gadget |
| POST | `/gadgets` | Create a new gadget |
| PATCH | `/gadgets/:id` | Update a gadget |
| DELETE | `/gadgets/:id` | Delete a gadget |
| POST | `/upload` | Upload an image to Firebase Storage |
| POST | `/payment` | Process a Stripe payment |

---

## Features

- Browse and search gadgets
- Create and manage gadget listings
- Firebase email/password authentication
- Like/wishlist gadgets (persisted in Redux)
- Shopping cart
- Stripe checkout for purchases
- Image upload via Firebase Storage

---

## Environment Variables Reference

### `server/.env`

| Key | Description |
|-----|-------------|
| `PORT` | Server port (default `5001`) |
| `MONGO_URI` | MongoDB connection string |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket URL |
| `GOOGLE_SERVICE_ACCOUNT_PATH` | Path to Firebase service account JSON |

### `client/.env`

| Key | Description |
|-----|-------------|
| `REACT_APP_FIREBASE_API_KEY` | Firebase API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID |

---

## Notes

- After editing `client/.env`, restart the React dev server — CRA only reads env vars on startup.
- The `client/.env` and `server/.env` files are gitignored. Never commit real API keys.
- Firebase Auth errors (`auth/invalid-api-key`) mean the `REACT_APP_FIREBASE_*` vars are missing or incorrect.
