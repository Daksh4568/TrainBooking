// require('dotenv').config();
// const express = require('express');
// const connectToDatabase = require('./db/db');
// const seatRouter = require('./routes/seatRouter');
// const router = require('./routes/authRoutes');
// const { seatModel } = require('./models/trainSeatModel');

// const app = express();
// app.use(express.json());

// // Connect to MongoDB and initialize seats if needed
// connectToDatabase().then(async () => {
//     const count = await seatModel.countDocuments();
//     if (count === 0) {
//         const seatsArray = [];
//         // For rows 1 to 11 (7 seats each)
//         for (let row = 1; row <= 11; row++) {
//             for (let seat = 1; seat <= 7; seat++) {
//                 seatsArray.push({ seatNo: seat, rowNumber: row, isBooked: false });
//             }
//         }
//         // Last row (row 12) with 3 seats
//         for (let seat = 1; seat <= 3; seat++) {
//             seatsArray.push({ seatNo: seat, rowNumber: 12, isBooked: false });
//         }
//         await seatModel.insertMany(seatsArray);
//         console.log("Seats initialized in the database.");
//     }
// });

// // Define routes
// app.use('/api/auth', router);      // Signup & Login routes
// app.use('/api/seats', seatRouter);       // Seat booking routes

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import cors
const connectToDatabase = require('./db/db');
const seatRouter = require('./routes/seatRouter');
const router = require('./routes/authRoutes');
const { seatModel } = require('./models/trainSeatModel');

const app = express();

// Used cors to allow cross-origin requests from any origin
app.use(cors());

// Use express.json() to parse JSON bodies
app.use(express.json());

// Connect to MongoDB and initialize seats if needed
connectToDatabase().then(async () => {
    const count = await seatModel.countDocuments();
    if (count === 0) {
        const seatsArray = [];
        // For rows 1 to 11 (7 seats each)
        for (let row = 1; row <= 11; row++) {
            for (let seat = 1; seat <= 7; seat++) {
                seatsArray.push({ seatNo: seat, rowNumber: row, isBooked: false });
            }
        }
        // Last row (row 12) with 3 seats
        for (let seat = 1; seat <= 3; seat++) {
            seatsArray.push({ seatNo: seat, rowNumber: 12, isBooked: false });
        }
        await seatModel.insertMany(seatsArray);
        console.log("Seats initialized in the database.");
    }
});

app.use('/api/auth', router);       // Signup & Login routes
app.use('/api/seats', seatRouter);    // Seat booking routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
