const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema(
    {
        hotelName: {
            type: String,
            unique: true
        },
        description: {
            type: String
        },
        amentities: {
            type: String
        },
        phoneNo: {
            type: Number
        },
        address: {
            type: String
        },
        reviews: {
            type: Array
        }
    }, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
}
);

const hotelModel = mongoose.model('hotels', hotelSchema);

module.exports = hotelModel;