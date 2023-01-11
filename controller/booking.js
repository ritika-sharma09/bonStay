const bookingModel = require('../model/bookingSchema');
const userModel = require('../model/userSchema');
const hotelModel = require('../model/hotelSchema');


exports.bookaRoom = async (req, res) => {
    try {

        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        let personNo = req.body.noOfPersons;
        let roomNo = req.body.noOfRooms;
        let startDateRes = await startDateValidation(startDate, res);
        let endDateRes = await endDateValidation(startDate, endDate, res);
        let noOfPersonsRes = await noOfPersonValidation(personNo, res);
        let noOfRoomsRes = await noOfRoomValidation(roomNo, res);
        if (startDateRes && endDateRes && noOfPersonsRes && noOfRoomsRes) {
            await bookingCreated(req, res);
        }


    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}

exports.bookingReschedule = async (req, res) => {
    try {
        let newStartDate = req.body.startDate;
        let newEndDate = req.body.endDate;
        let newStartDateRes = await startDateValidation(newStartDate, res);
        let newEndDateRes = await endDateValidation(newStartDate, newEndDate, res);
        if (newStartDateRes && newEndDateRes) {
            let userId = req.params.userId;
            let bookingID = req.body.bookingId;
            let id = await userModel.findOne({ userId: userId });
            if (id) {
                await bookingModel.findOneAndUpdate({ bookingId: bookingID }, req.body);
                res.status(201).json({
                    status: "success",
                    message: "Successfully rescheduled the booking."
                })
            } else {
                res.status(400).json({
                    status: "error",
                    data: {
                        message: "Not a valid User Id."
                    }
                });
            }
        }
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}


let bookingCreated = async (req, res) => {
    let userId = req.params.userId;
    let hotelName = req.params.hotelName;
    if (userId && hotelName) {
        let id = await userModel.findOne({ userId: userId });
        let hotelname = await hotelModel.findOne({ hotelName: hotelName });
        console.log("hotelname :", hotelname);
        if (id) {
            if (hotelname) {
                let bookingRes = await bookingModel.create(req.body);

                let userBooking = [{
                    "_id": bookingRes._id,
                    "BookingId": bookingRes.bookingId,
                    "StartDate": bookingRes.startDate,
                    "EndDate": bookingRes.endDate,
                    "HotelName": hotelName,
                    "NoOfPersons": bookingRes.noOfPersons,
                    "NoOfRooms": bookingRes.noOfRooms,
                    "TypeOfRoom": bookingRes.typeOfRoom
                }];

                await userModel.findOneAndUpdate({ userId: userId }, { userBookings: userBooking });
                res.status(201).json({
                    status: "success",
                    message: "Successfully made a booking."
                })
            } else {
                res.status(400).json({
                    status: "error",
                    data: {
                        message: "Not a valid Hotel Name"
                    }
                });
                return false;
            }
        } else {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Not a valid User Id"
                }
            });
            return false;
        }
    }
}

exports.cancelaBooking = async (req, res) => {
    try {
        let userId = req.params.userId;
        let bookingId = req.params.bookingId;
        let id = await userModel.findOne({ userId: userId });
        let bookId;
        id.userBookings.forEach((data) => {
            bookId = data.bookingId;
        })

        if (id && bookingId == bookId) {
            await bookingModel.findOneAndDelete({ bookingId: bookingId });
            let bookingData = id.userBookings.filter((ele) => {
                return ele.bookingId != bookId;
            });
            console.log("bookingData", bookingData);
            await userModel.findOneAndUpdate({ userId: userId }, { userBookings: bookingData })
            res.status(201).json({
                status: "success",
                message: "Successfully deleted the booking."
            })
        }
        else {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Could not delete the booking"
                }
            });
        }
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}

exports.listOfUserBookings = async (req, res) => {
    try {
        let userId = req.params.userId;
        let id = await userModel.findOne({ userId: userId });
        if (id) {
            let userBookingList = id.userBookings;
            if (userBookingList.length > 0) {
                res.status(201).json({
                    status: "success",
                    result: userBookingList.length,
                    data: [{ "UserBookings": userBookingList }]
                })
            }
            else {
                res.status(400).json({
                    status: "error",
                    data: {
                        message: "No Booking done yet"
                    }
                });
            }
        }
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}
let startDateValidation = async (startDate, res) => {
    let date = new Date();
    let todayDate = date.toISOString().split('T')[0];
    if (startDate >= todayDate) {
        return true;
    } else {
        res.status(400).json({
            status: "error",
            data: {
                message: "Start Date should be a date greater than or equal to today"
            }
        });
        return false;
    }
}

let endDateValidation = async (startDate, endDate, res) => {
    if (endDate >= startDate) {
        return true;
    } else {
        res.status(400).json({
            status: "error",
            data: {
                message: "End Date should be a date greater than or equal to Start Date"
            }
        });
        return false;
    }
}

let noOfPersonValidation = async (personNo, res) => {
    if (personNo.length > 0 && personNo.length <= 5) {
        return true;
    } else {
        res.status(400).json({
            status: "error",
            data: {
                message: "Number of persons should be a valid number greater than 0 and less than or equal to 5"
            }
        });
        return false;
    }
}

let noOfRoomValidation = async (roomNo, res) => {
    if (roomNo.length > 0 && roomNo.length <= 3) {
        return true;
    } else {
        res.status(400).json({
            status: "error",
            data: {
                message: "Number of rooms should be a valid number greater than 0 and less than or equal to 3"
            }
        });
        return false;
    }
}

