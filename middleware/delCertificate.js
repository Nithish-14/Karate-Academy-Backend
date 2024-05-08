const delCertificate = (req, res, next) => {
    if (req.body.certificate_id !== undefined) {
        req.opt = "certificate";
    } else {
        req.opt = "student";
    }

    next();
}

module.exports = delCertificate