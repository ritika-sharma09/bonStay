
const userModel = require('../model/userSchema');

exports.userRegisteration = async (req, res) => {
    try {
        let name = req.body.name;
        let phone = req.body.phoneNo;
        let pasword = req.body.password;
        let email = req.body.emailId;
        let nameResp = await nameValidation(name, res);
        let phoneResp = await phoneNoValidation(phone, res);
        let pswdResp = await passwordValidation(pasword, res);
        let emailResp = await emailVaildation(email, res);
        if (nameResp && phoneResp && pswdResp && emailResp) {
            let userData = await userModel.findOne({ emailId: email });
            console.log(userData);
            if (!userData) {
                await userModel.create(req.body);
                res.status(201).json({
                    status: "success",
                    message: "User successfully registered."
                })
            } else {
                res.status(404).json({
                    status: "error",
                    data: {
                        message: "User exists with this email id"
                    }
                })
            }
        }


    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
}


exports.userLogin = async (req, res) => {
    try {
        let pswdValidate = await passwordValidation(req.body.password);
        if (pswdValidate) {
            let userData = await userModel.findOne({ userId: req.body.userId, password: req.body.password });

            if (userData) {
                res.cookie('username', req.body.userId).status(201).json({
                    message: "cookie set"
                });
            } else {
                res.status(400).json({
                    status: "error",
                    data: {
                        message: "Incorrect user id or password"
                    }
                })
            }
        }
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}

exports.userLogout = (req, res) => {
    try {
        res.clearCookie('username').status(200).json(
            { message: "You are logged out!!" });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}
let passwordValidation = async (psswd, res) => {
    if (psswd.length >= 8 && psswd.length <= 12) {
        console.log("psswd", psswd);
        return true;
    } else {
        res.status(400).json({
            status: "error",
            data: {
                message: "Enter a valid password with atleast 8 and not more than 12 characters"
            }
        })
        return false;
    }

}

let nameValidation = async (name, res) => {
    if (name.trim().length >= 3) {
        return true;
    } else {
        res.status(404).json({
            status: "error",
            data: {
                message: "Enter a valid name with atleast 3 characters"
            }
        })
        return false;
    }
}

let emailVaildation = async (emailId, res) => {
    let regex = /^\S+@\S.\S+$/;
    if (regex.test(emailId.trim())) {
        return true;
    } else {
        res.status(404).json({
            status: "error",
            data: {
                message: "Enter a valid email id"
            }
        })
        return false;
    }
}

let phoneNoValidation = async (phoneno, res) => {
    if (phoneno.trim().length === 10) {
        return true;
    } else {
        res.status(404).json({
            status: "error",
            data: {
                message: "Enter a valid phone no. with 10 digits"
            }
        })
        return false;
    }
}

