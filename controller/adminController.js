const Admin = require("../model/adminSchema");

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
    }

}

module.exports =  adminController 