const verifyUser = (req, res, next) => {
    const {userData} = req;

    if (userData.role === "admin") {
        next();
    } else {
        return res.status(401).json({message: "Unauthorized Access"})
    }
}

module.exports = verifyUser;