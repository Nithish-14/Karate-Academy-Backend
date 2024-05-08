const verifyStudent = (req, res, next) => {
    const {userData} = req;

    if (userData.role === "student") {
        next();
    } else {
        return res.status(401).json({message: "Unauthorized Access"})
    }
}

module.exports = verifyStudent;