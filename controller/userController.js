const User = require("../model/userSchema");

const userController = {
    getFrequentlyUser: async (req, res) => {
        try {
            const allUsers = await User.find().sort({ howMuchRepeat: -1 });
            res.json(allUsers);

        } catch (error) {
            res.json({ errorMessage: "something went wrong", error })
        }
    }
}

module.exports = userController;