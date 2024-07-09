const Admin = require("../model/adminSchema");
const { uid } = require("uid")
const nodemailer = require("nodemailer")
let otp;
let adminMail; // need to update pass in resetPass route. it take value from submitForgetPassMail

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Your email service provider
    auth: {
        user: 'shafinahnam89@gmail.com', // Your email address
        pass: 'etoytxvjxixpooow' // Your email password
    }
});

const adminController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const isExist = await Admin.findOne({ email: email, password: password });
            if (!isExist) {
                return res.json({ success: false })
            }
            res.json({ success: true })
        } catch (error) {
            res.json({ message: false })
        }
    },
    submitForgetPassMail: async (req, res) => {
        try {
            const { forgetPasswordEmail } = req.body;
            adminMail = forgetPasswordEmail;
            const adminDataCollection = await Admin.findOne({ email: forgetPasswordEmail });

            if (!adminDataCollection) {
                return res.json({ success: false, error: "email doesnt exist" })
            }

            otp = uid(6)

            transporter.sendMail({
                from: 'shafinahnam89@gmail.com',
                to: forgetPasswordEmail,
                subject: 'Welcome to Vulnapp',
                html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            -webkit-font-smoothing: antialiased;
                            -moz-osx-font-smoothing: grayscale;
                        }
                        .container {
                            width: 60%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0px -1px 5px 10px rgba(217,204,204,0.48);
-webkit-box-shadow: 0px -1px 5px 10px rgba(217,204,204,0.48);
-moz-box-shadow: 0px -1px 5px 10px rgba(217,204,204,0.48);
                        }
                        .header {
                            text-align: center;
                            padding-bottom: 20px;
                        }
                        .header img {
                            width: 150px;
                        }
                        .content {
                            text-align: left;
                        }
                        .content h1 {
                            color: #333333;
                        }
                        .content p {
                            color: #666666;
                            line-height: 1.5;
                        }
                        .footer {
                            text-align: center;
                            padding-top: 20px;
                            border-top: 1px solid #eeeeee;
                            color: #999999;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        
                        <div class="content">
                            <p>Dear Admin!</p>
                            <p>Your OTP</p>
                            <h1>${otp}</h1>
                            <p>Bria Unisex Salon</p>
                            
                        </div>
                    </div>
                </body>
                </html>
                `
            });

            res.json({ success: true, message: "please check your email. You will get an OTP" })

        } catch (error) {
            res.json({ error: "something went wrong. Please try again", success: false })
        }
    },
    submitForgetPassOTP: async (req, res) => {
        try {
            const { resetOTP } = req.body;

            if (otp === resetOTP) {
                return res.json({ success: true })
            }
            return res.json({ success: false })

        } catch (error) {
            res.json({ success: false, error: "Something went wrong. Please try again" })
        }
    },
    resetPass: async (req, res) => {
        try {
            const { newPass, confirmNewPass } = req.body;

            if (newPass === confirmNewPass) {
                const passChanged = await Admin.findOneAndUpdate(
                    { email: adminMail },
                    { password: newPass },
                    { new: true }
                )
                if (passChanged) {
                    transporter.sendMail({
                        from: 'shafinahnam89@gmail.com',
                        to: adminMail,
                        subject: 'Welcome to Vulnapp',
                        html: `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                    -webkit-font-smoothing: antialiased;
                                    -moz-osx-font-smoothing: grayscale;
                                }
                                .container {
                                    width: 60%;
                                    max-width: 600px;
                                    margin: 0 auto;
                                    background-color: #ffffff;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0px -1px 5px 10px rgba(217,204,204,0.48);
        -webkit-box-shadow: 0px -1px 5px 10px rgba(217,204,204,0.48);
        -moz-box-shadow: 0px -1px 5px 10px rgba(217,204,204,0.48);
                                }
                                .header {
                                    text-align: center;
                                    padding-bottom: 20px;
                                }
                                .header img {
                                    width: 150px;
                                }
                                .content {
                                    text-align: left;
                                }
                                .content h1 {
                                    color: #333333;
                                }
                                .content p {
                                    color: #666666;
                                    line-height: 1.5;
                                }
                                .footer {
                                    text-align: center;
                                    padding-top: 20px;
                                    border-top: 1px solid #eeeeee;
                                    color: #999999;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                
                                <div class="content">
                                    <p>Dear Admin!</p>
                                    <p>Your password has been updated</p>
                                    <p>Your new password is:</p>
                                    <h1>${newPass}</h1>
                                    <p>Bria Unisex Salon</p>
                                    
                                </div>
                            </div>
                        </body>
                        </html>
                        `
                    });
                    res.json({ success: true, message: "Password updated" })
                }
            }
            res.json({ success: false, error: "something went wrong. Please try again" })
        } catch (error) {
            res.json({ success: false, error: "Something went wrong." })
        }
    }



}

module.exports = adminController 