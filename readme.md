# Train Seat Booking API

This is the backend for the Train Seat Booking System. It provides authentication, seat availability, booking, and reset functionalities using **Node.js, Express, MongoDB, and JWT authentication**.

## 🚀 Features

- User **Signup & Login** with JWT authentication.
- Fetch **available seats**.
- **Book seats** while ensuring row-wise allocation.
- **Reset all bookings** (Admin feature).
- I have ensured that person can reserve up to 7 seats at a time and the priority will be to book them in one row.
  -Book seats while ensuring row-wise allocation.
  -User Signup & Login with JWT authentication.

---

## 🛠️ Setup Instructions

### 1️⃣ **Clone the Repository**

```sh
git clone https://github.com/your-username/trainseatbooking-backend.git
cd trainseatbooking-backend
```

### 2️⃣ **Install Dependencies**

```sh
npm install
```

### 3️⃣ **Set Up Environment Variables**

Create a `.env` file in the root directory and add:

```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```

### 4️⃣ **Start the Server**

```sh
npm start
```

The server will run on `http://localhost:5000`

---

## 🔗 Live API Base URL

👉 **`https://trainbooking-fg34.onrender.com`**

---

## 📌 API Endpoints

### **🔐 Auth Routes**

#### 1️⃣ **User Signup**

```http
POST /signup
```

**Body (JSON):**

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

#### 2️⃣ **User Login**

```http
POST /login
```

**Body (JSON):**

```json
{
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "token": "your-jwt-token"
}
```

---

### **🚆 Seat Routes**

#### 3️⃣ **Get All Seats & Availability**

```http
GET /seats
```

**Response:**

```json
{
  "totalAvailableSeats": 20,
  "seats": [
    { "rowNumber": 1, "seatNo": 1, "isBooked": false },
    { "rowNumber": 1, "seatNo": 2, "isBooked": true }
  ]
}
```

#### 4️⃣ **Book Seats (Requires Auth)**

```http
PATCH /seats/book
```

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Body (JSON):**

```json
{
  "seats": 2
}
```

**Response:**

```json
["Row 1 Seat 3", "Row 1 Seat 4"]
```

#### 5️⃣ **Reset All Seats (Requires Auth)**

```http
PATCH /seats/reset
```

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Response:**

```json
{
  "message": "All seats are now available for booking."
}
```

---

## 🔬 Testing the API

You can test the API using **Postman**:

1. Make a **POST request** to `/signup` or `/login` to get a JWT token.
2. Use the **token** in the **Authorization Header** to access protected routes (`/seats/book`, `/seats/reset`).
3. Fetch seat details with a simple **GET request** to `/seats`.

## 👨‍💻 Author

**Daksh Pratap Singh**

Feel free to contribute or report issues! 🚀
