const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
    {
        bookingId :{
            type: String
            // ref : 'users'
        },
        startDate:{
            type : Date
        },
        endDate:{
            type : Date
        },
        noOfPersons:{
            type : Number
        },
        noOfRooms:{
            type : Number
        },
        typeOfRoom:{
            type: String
        },
        userId:{
            type: String
        }
    }
);

const bookingModel = mongoose.model('bookings',bookingSchema);

module.exports = bookingModel;