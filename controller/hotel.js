const hotelModel = require('../model/hotelSchema');
exports.getHotelDetails = async (req, res) => {
  try {
    let hotels = await hotelModel.find();
    if (hotels.length > 0) {
      res.status(200).json({
        status: "success",
        results: hotels.length,
        data: {
          "hotels": hotels
        }
      });
    }
    else {
      res.status(404).json({
        status: "error",
        data: {
          message: "There is no details present in db"
        }
      })
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    })
  }
}

exports.addaReview = async (req, res) => {
  try {
    let updatedData = await hotelModel.findOneAndUpdate({ hotelName: req.body.hotelName }, {
      reviews: req.body.reviews
    });
    if (updatedData != null) {
      res.status(201).json({
        status: "success",
        message: `Successfully added the review for ${req.body.hotelName}`
      })
    } else {
      res.status(400).json({
        status: "error",
        data: {
          message: "Not a valid Hotel Name"
        }
      })
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    })
  }
}

exports.getAllReviews = async (req, res) => {
  try {
    let hotel = await hotelModel.findOne({ hotelName: req.params.hotelName });
    if (hotel) {
      let review = hotel.reviews;
      if (review.length > 0) {
        res.status(200).json({
          status: "success",
          results: review.length,
          data: [{
            "Reviews": review
          }]
        });
      }
      else {
        res.status(400).json({
          status: "error",
          data: {
            message: `No reviews added yet for ${req.params.hotelName}`
          }
        })
      }
    }
    else {
      res.status(400).json({
        status: "error",
        data: {
          message: `${req.params.hotelName} is not a valid Hotel Name`
        }
      })
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    })
  }
}