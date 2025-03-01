const express = require('express');
const seatRouter = express.Router();
const { seatModel } = require('../models/trainSeatModel');
const { checkCount } = require('../middleware/count');
const { protect } = require('../middleware/auth');

// GET route: Fetch all seats sorted by rowNumber and seatNo
seatRouter.get('/', async (req, res) => {
    try {
        const seats = await seatModel.find().sort({ rowNumber: 1, seatNo: 1 });
        const totalAvailableSeats = await seatModel.countDocuments({ isBooked: false });

        res.status(200).send({ totalAvailableSeats, seats });
    } catch (err) {
        res.status(500).send({ message: "Error fetching seats", err });
    }
});

// PATCH route: Book seats
seatRouter.patch('/book', protect, checkCount, async (req, res) => {
    const requiredSeats = req.body.seats;
    console.log({ requiredSeats });
    try {
        // Fetch seats sorted by rowNumber and seatNo
        const seats = await seatModel.find().sort({ rowNumber: 1, seatNo: 1 });

        // Group seats by rowNumber for better row-wise handling
        const rows = {};
        seats.forEach(seat => {
            if (!rows[seat.rowNumber]) rows[seat.rowNumber] = [];
            rows[seat.rowNumber].push(seat);
        });

        let reserved = [];
        for (const row in rows) {
            const rowSeats = rows[row];
            let block = [];
            for (let i = 0; i < rowSeats.length; i++) {
                if (!rowSeats[i].isBooked) {
                    if (block.length === 0 || rowSeats[i].seatNo === block[block.length - 1].seatNo + 1) {
                        block.push(rowSeats[i]);
                    } else {
                        block = [rowSeats[i]];
                    }
                    if (block.length === requiredSeats) {
                        for (let seat of block) {
                            reserved.push(`Row ${seat.rowNumber} Seat ${seat.seatNo}`);
                            await seatModel.findByIdAndUpdate(seat._id, { isBooked: true, bookedBy: req.user.id });
                        }
                        break;
                    }
                } else {
                    block = [];
                }
            }
            if (reserved.length === requiredSeats) break;
        }

        if (reserved.length !== requiredSeats) {
            const isEmpty = await seatModel.find({ isBooked: false }).sort({ rowNumber: 1, seatNo: 1 });
            if (isEmpty.length < requiredSeats) {
                return res.status(400).send({ message: "Sorry, we don't have enough seats to book." });
            } else {
                reserved = [];
                for (let i = 0; i < requiredSeats; i++) {
                    reserved.push(`Row ${isEmpty[i].rowNumber} Seat ${isEmpty[i].seatNo}`);
                    await seatModel.findByIdAndUpdate(isEmpty[i]._id, { isBooked: true, bookedBy: req.user.id });
                }
            }
        }
        res.status(200).send(reserved);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Booking failed", err });
    }
});

// PATCH route: Reset all seats to available
seatRouter.patch('/reset', protect, async (req, res) => {
    try {
        await seatModel.updateMany({ isBooked: true }, { isBooked: false, bookedBy: null });
        res.status(200).send({ message: "All seats are now available for booking." });
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

module.exports = seatRouter;