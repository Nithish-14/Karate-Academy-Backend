const connection = require("../db/index.js");
const fs = require("fs").promises;

const uploadCertificate = async (req, res) => {
    try {
        const {student_id, course_id, issue_date} = req.body;

        if (!student_id || !course_id || !issue_date) {
            return res.status(400).json({message: "All fields are required"});
        }

        const file = req.file;

        if (!file) {
            return res.status(400).json({message: "No file uploaded"});
        }

        const imageBuffer = await fs.readFile(file.path);

        const insertCertificateQuery = `INSERT INTO certificate (student_id, course_id, issue_date, certificate_file)
                                        VALUES (?, ?, ?, ?)`;

        connection.query(insertCertificateQuery, [student_id, course_id, issue_date, imageBuffer], async (error, results) => {
            if (error) {
                console.log("Error uploading certificate: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            await fs.unlink(file.path);
            if (results.affectedRows === 1) {
                return res.status(200).json({message: "Certificate uploaded to database", certificate_id: results.insertId});
            }
        })
    
    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const updateCertificate = async (req, res) => {
    try {
        const {certificateId} = req.params;

        const {student_id, course_id, issue_date} = req.body;

        if (!student_id || !course_id || !issue_date) {
            return res.status(400).json({message: "All fields are required"});
        }

        const file = req.file;

        if (!file) {
            return res.status(400).json({message: "No file uploaded"});
        }

        const imageBuffer = await fs.readFile(file.path);

        const certificateIdQuery = `SELECT * FROM certificate WHERE certificate_id = ?`;

        connection.query(certificateIdQuery, [certificateId], (error, results) => {
            if (error) {
                console.log("Error validating certificate id for certificate updation: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid certificate id"});
            } else {
                const updateCertificateQuery = `UPDATE certificate SET student_id = ?, course_id = ?, issue_date = ?, certificate_file = ? WHERE certificate_id = ?`;

                connection.query(updateCertificateQuery, [student_id, course_id, issue_date, imageBuffer, certificateId], async (error, results) => {
                    if (error) {
                        console.log("Error updating certificate: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }
                    
                    await fs.unlink(file.path);
                    if (results.affectedRows === 1) {
                        return res.status(201).json({message: 'Certificate updated successfully'});
                    }
                })
            }
        })


    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const deleteCertificate = (req, res) => {
    try {
        let id;

        if (req.opt === "certificate") {
            id = req.body.certificate_id;
        } else {
            id = req.body.student_id;
        }
        

        const checkCertificateIdQuery = `SELECT * FROM certificate WHERE ${req.opt}_id = ?`;

        connection.query(checkCertificateIdQuery, [id], (error, results) => {
            if (error) {
                console.log(`Error validating ${req.opt} id: `, error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: `Invalid ${req.opt}`}); 
            } else {
                const deleteCertificateQuery =  `DELETE FROM certificate WHERE ${req.opt}_id = ?`;

                connection.query(deleteCertificateQuery, [id], (error, results) => {
                    if (error) {
                        console.log("Error deleting certificate: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    return res.status(200).json({message: "Certificate deleted successfully"})
                })
            }
        })


    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getAllCertificates = (req, res) => {
    try {
        let {certificate_id=undefined, student_id=undefined, course_id=undefined} = req.query;

        let params = []

        let getCertificatesQuery = `SELECT certificate_id, student.name AS student_name, course_name, issue_date FROM certificate INNER JOIN student ON certificate.student_id = student.student_id
                                    INNER JOIN course ON certificate.course_id = course.course_id`;

        
        if (certificate_id !== undefined) {
            params.push(certificate_id);
            getCertificatesQuery += ` WHERE certificate.certificate_id = ?`
        }

        if (student_id !== undefined) {
            if (params.length > 0) {
                getCertificatesQuery += ' AND';
            } else {
                getCertificatesQuery += ' WHERE';
            }
            getCertificatesQuery += ` certificate.student_id = ?`;
            params.push(student_id)
        }

        if (course_id !== undefined) {
            if (params.length > 0) {
                getCertificatesQuery += ' AND';
            } else {
                getCertificatesQuery += ' WHERE';
            }
            getCertificatesQuery += ` certificate.course_id = ?`;
            params.push(course_id)
        }

        connection.query(getCertificatesQuery, params, (error, results) => {
            if (error) {
                console.log("Error getting certificates: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            return res.status(200).json({certificates: results})
            
        })

    } catch(error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getCertificate = (req, res) => {
    try {
        const {certificateId} = req.params;

        const checkCertificateIdQuery = `SELECT certificate_id FROM certificate WHERE certificate_id = ?`;

        connection.query(checkCertificateIdQuery, [certificateId], (error, results) => {
            if (error) {
                console.log("Error validating certificate id: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            if (results.length === 0) {
                return res.status(400).json({message: 'Certificate not found'});
            } else {
                const getCertificateQuery = `SELECT certificate_file FROM certificate WHERE certificate_id = ?`;

                connection.query(getCertificateQuery, [certificateId], (error, results) => {
                    if (error) {
                        console.log("Error getting certificate: ", error)
                        return res.status(500).json({message: 'Internal Server Error'})
                    }

                    const fileData = results[0].certificate_file;

                    res.setHeader('Content-Type', 'image/jpeg');

                    return res.status(200).send(fileData);
                })
            }
        })

    } catch(error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = {uploadCertificate, updateCertificate, deleteCertificate, getAllCertificates, getCertificate}