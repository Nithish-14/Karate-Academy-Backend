const connection = require("../db/index.js");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../middleware/auth.js");

const studentRegister = async (req, res) => {
    try {
        const {name, dob, address, phone_no, email, father_name, father_occupation, father_mobile_no, mother_name, mother_occupation, mother_mobile_no, student_active} = req.body;

        // !!!Important -> dob should be in the format of 'year-month-day'

        if (!name || !dob || !address || !phone_no || !email ||
            !father_name || !father_occupation || !father_mobile_no ||
            !mother_name || !mother_occupation || !mother_mobile_no || student_active === undefined) {
                return res.status(400).json({message: "All fields are required"});
        }

        const emailExistenceQuery = `SELECT email FROM student WHERE email=?`;


        connection.query(emailExistenceQuery, [email], (error, results) => {
            if (error) {
                console.log("Error checking email existence: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length !== 0) {
                return res.status(400).json({message: "Email already exists."});
            } else {
                const insertStudentQuery = `INSERT INTO student (name, dob, address, phone_no, email, father_name, father_occupation, father_mobile_no, mother_name, mother_occupation, mother_mobile_no, student_active)
                                    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        
                connection.query(insertStudentQuery, [name, dob, address, phone_no, email, father_name, father_occupation, father_mobile_no, mother_name, mother_occupation, mother_mobile_no, student_active], (error, results) => {
                    if (error) {
                        console.log("Error creating new student: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }
                    
                    if (results.affectedRows === 1) {
                        return res.status(200).json({message: "Student registered successfully", student_id: results.insertId})
                    }
                })
                    }
        })
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const addCredentials = (req, res) => {
    const {student_id, username, password} = req.body;

    if (!student_id || !username || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    const checkStudentIdQuery = `SELECT * FROM student WHERE student_id = ?`;

    connection.query(checkStudentIdQuery, [student_id], (error, results) => {
        if (error) {
            console.log("Error validating student id: ", error);
            return res.status(500).json({message: "Internal Server Error"});
        }

        if (results.length === 0) {
            return res.status(400).json({message: "Invalid student id"});
        } else {
            const checkStudentCredentialExistQuery = `SELECT * FROM student_login WHERE student_id = ?`;

            connection.query(checkStudentCredentialExistQuery, [student_id], (error, results) => {
                if (error) {
                    console.log("Error validating student credential: ", error);
                    return res.status(500).json({message: "Internal Server Error"});
                }

                if (results.length === 0) {
                    const createStudentCredentialQuery = `INSERT INTO student_login (student_id, username, password)
                                                  VALUES (?, ?, ?)`;

                    connection.query(createStudentCredentialQuery, [student_id, username, password], (error, results) => {
                        if (error) {
                            console.log("Error creating student login credentials: ", error);
                            return res.status(500).json({message: "Internal Server Error"});
                        }

                        if (results.affectedRows === 1) {
                            return res.status(200).json({message: "Student credentials registered successfully"})
                        }
                    })
                } else {
                    const updateStudentCredentialQuery = `UPDATE student_login SET username = ?, password = ? WHERE student_id = ?`;

                    connection.query(updateStudentCredentialQuery, [username, password, student_id], (error, results) => {
                        if (error) {
                            console.log("Error creating student login credentials: ", error);
                            return res.status(500).json({message: "Internal Server Error"});
                        }

                        return res.status(200).json({message: "Student credentials registered successfully"})
                    })
                }
            })



            
        }
    })
}

const updateStudent = (req, res) => {
    try {
        const {studentId} = req.params;
        
        const {name, dob, address, phone_no, email, father_name, father_occupation, father_mobile_no, mother_name, mother_occupation, mother_mobile_no, student_active} = req.body;

        if (!name || !dob || !address || !phone_no || !email ||
            !father_name || !father_occupation || !father_mobile_no ||
            !mother_name || !mother_occupation || !mother_mobile_no) {
                return res.status(400).json({message: "All fields are required"});
        }

        const checkStudentIdQuery = `SELECT * FROM student WHERE student_id = ?`;

        connection.query(checkStudentIdQuery, [studentId], (error, results) => {
            if (error) {
                console.log("Error checking student id: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid Student Id"});
            } else {
                const updateQuery = `UPDATE student SET ? WHERE student_id = ?`

                const updatedFields = req.body;

                connection.query(updateQuery, [updatedFields, studentId], (error, results) => {
                    if (error) {
                        console.log("Error updating student details: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    if (results.affectedRows === 1) {
                        return res.status(201).json({message: 'Student details updated successfully'});
                    }
                })
            }
        })

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const deleteStudentCredential = (req, res) => {
    try {
        const {student_id} = req.body;

        const checkStudentIdQuery = `SELECT * FROM student_login WHERE student_id = ?`;

        connection.query(checkStudentIdQuery, [student_id], (error, results) => {
            if (error) {
                console.log("Error validating student id for removing student credentials: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "No student credentials found for the requested student id"}); 
            } else {
                const deleteStudentCredentialQuery = `DELETE FROM student_login WHERE student_id = ?`;

                connection.query(deleteStudentCredentialQuery, [student_id], (error, results) => {
                    if (error) {
                        console.log("Error removing student credentials: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    return res.status(200).json({message: "Student credentials deleted successfully"})
                })
            }
        })

    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getAllStudents = (req, res) => {
    try {
        const getStudentsQuery = `SELECT * FROM student`

        connection.query(getStudentsQuery, (error, results) => {
            if (error) {
                console.log("Error getting student details: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            return res.status(200).json({students: results})
        });


    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getAllStudentCredentials = (req, res) => {
    try {
        const getCredentialsQuery = `SELECT * FROM student_login`;

        connection.query(getCredentialsQuery, (error, results) => {
            if (error) {
                console.log("Error getting student credentials: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            return res.status(200).json({credentials: results})
        })

    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getStudentDetail = (req, res) => {
    try {
        const {studentId} = req.params;

        const getStudentQuery = `SELECT * FROM student WHERE student_id = ?`;

        connection.query(getStudentQuery, [studentId], (error, results) => {
            if (error) {
                console.log("Error getting student detail: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            return res.status(200).json({student: results})
        })


    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const studentLogin = (req, res) => {
    try {
        let {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        username = username.toLowerCase();

        const verifyStudentLoginQuery = `SELECT * FROM student_login WHERE username = ?`;

        connection.query(verifyStudentLoginQuery, [username], (error, results) => {
            if (error) {
                console.log("Error verifying student username: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid username"});
            } else {
                const verifyPassswordQuery = `SELECT * FROM student_login WHERE username = ? AND password = ?`;

                connection.query(verifyPassswordQuery, [username, password], (error, results) => {
                    if (error) {
                        console.log("Error verifying student password: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    if (results.length === 0) {
                        return res.status(400).json({message: "Invalid password"});
                    } else {
                        const payload = {
                            user_id: results[0].student_id,
                            role: 'student'
                        }

                        const jwtToken = jwt.sign(payload, SECRET, {expiresIn: '30d'});
                        return res.status(201).json({jwtToken: jwtToken});
                    }
                })
            }
        })


    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const studentInfo = (req, res) => {
    try {
        const {userData} = req;
        
        const studentId = userData.user_id;

        const getStudentQuery = `SELECT * FROM student WHERE student_id = ?`;

        connection.query(getStudentQuery, [studentId], (error, results) => {
            if (error) {
                console.log("Error getting student detail: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            return res.status(200).json({student_info: results[0]})
        })

    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const studentCredential = (req, res) => {
    try {
        const {userData} = req;
        
        const studentId = userData.user_id;

        const getStudentCredentialQuery = `SELECT * FROM student_login WHERE student_id = ?`

        connection.query(getStudentCredentialQuery, [studentId], (error, results) => {
            if (error) {
                console.log("Error getting student credential: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            return res.status(200).json({student_credential: results[0]})
        })

    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const updateStudentCredential = (req, res) => {
    try {

        const {userData} = req;
        
        const studentId = userData.user_id;

        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const updateCredentialQuery = `UPDATE student_login SET username = ?, password = ? WHERE student_id = ?`;

        connection.query(updateCredentialQuery, [username, password, studentId], (error, results) => {
            if (error) {
                console.log("Error updating student credential: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            return res.status(200).json({message: "Student credentials updated successfully"})
        })


    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = {studentRegister, addCredentials, updateStudent, deleteStudentCredential, getAllStudents, getAllStudentCredentials, getStudentDetail, studentLogin, studentInfo, studentCredential, updateStudentCredential}