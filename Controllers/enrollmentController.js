const connection = require("../db/index.js");

const registerCourse = (req, res) => {
    try {
        const {studentId} = req.params;

        const {course_name, enrollment_date} = req.body;

        if (!course_name || !enrollment_date) {
            return res.status(400).json({message: "All fields are required"});
        }
        
        const checkStudentIdQuery = `SELECT * FROM student WHERE student_id = ?`

        connection.query(checkStudentIdQuery, [studentId], (error, results) => {
            if (error) {
                console.log("Error validating student id for registering course: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }
            
            if (results.length === 0) {
                return res.status(400).json({message: "Invalid student"});
            } else {
                const getCourseIdQuery = `SELECT course_id FROM course WHERE course_name = ?`;


                connection.query(getCourseIdQuery, [course_name], (error, results) => {
                    if (error) {
                        console.log("Error getting course id: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }
        
                    if (results.length === 0) {
                        return res.status(400).json({message: "Invalid course"});
                    } else {
                        const courseId = results[0].course_id;


                        const studentAlreadyRegisteredQuery = `SELECT * FROM student_course WHERE student_id = ? AND course_id = ?`;

                        connection.query(studentAlreadyRegisteredQuery, [studentId, courseId], (error, results) => {
                            if (error) {
                                console.log("Error checking when student already registered course or not: ", error);
                                return res.status(500).json({message: "Internal Server Error"});
                            }

                            if (results.length === 0) {
                                const registerCourseQuery = `INSERT INTO student_course (student_id, course_id, enrollment_date)
                                VALUES (?, ?, ?)`;

                                connection.query(registerCourseQuery, [studentId, courseId, enrollment_date], (error, results) => {
                                    if (error) {
                                        console.log("Error registering course: ", error);
                                        return res.status(500).json({message: "Internal Server Error"});
                                    }

                                    if (results.affectedRows === 1) {
                                        return res.status(201).json({message: 'Course registered successfully'});
                                    }
                                })
                            } else {
                                return res.status(400).json({message: "Student already registered for this course"})
                            }
                        })
                    }
                })
            }
        })
    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const updateStudentCourse = (req, res) => {
    try {
        const {enrollmentId} = req.params;

        const {student_id, course_id, enrollment_date} = req.body;

        if (!student_id || !course_id || !enrollment_date) {
            return res.status(400).json({message: "All fields are required"});
        } 

        const checkEnrollmentIdQuery = `SELECT * FROM student_course WHERE enrollment_id = ?`;

        connection.query(checkEnrollmentIdQuery, [enrollmentId], (error ,results) => {
            if (error) {
                console.log("Error validating enrollment id for course updation: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid enrollment id"});
            } else {
                const updateEnrollmentQuery = `UPDATE student_course SET ? WHERE enrollment_id = ?`;

                const updatedFields = req.body;

                connection.query(updateEnrollmentQuery, [updatedFields, enrollmentId], (error, results) => {
                    if (error) {
                        console.log("Error updating enrollment details: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    if (results.affectedRows === 1) {
                        return res.status(201).json({message: 'Enrollment details updated successfully'});
                    }
                })
            }
        })

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const deleteStudentCourse = (req, res) => {
    try {
        const {enrollment_id} = req.body;

        const checkEnrollmentIdQuery = `SELECT * FROM student_course WHERE enrollment_id = ?`;

        connection.query(checkEnrollmentIdQuery, [enrollment_id], (error, results) => {
            if (error) {
                console.log("Error validating enrollment id: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid enrollment"}); 
            } else {
                const deleteEnrollmentQuery =  `DELETE FROM student_course WHERE enrollment_id = ?`;

                connection.query(deleteEnrollmentQuery, [enrollment_id], (error, results) => {
                    if (error) {
                        console.log("Error deleting enrollment: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    return res.status(200).json({message: "Enrollment deleted successfully"})
                })
            }
        })


    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getAllEnrollments = (req, res) => {
    try {

        let {enrollment_id=undefined, student_id=undefined, course_id=undefined} = req.query;

        let params = [];

        let getEnrollmentsQuery = `SELECT enrollment_id, student.name AS student_name, course_name, enrollment_date FROM student_course INNER JOIN student ON student_course.student_id = student.student_id INNER JOIN course ON student_course.course_id = course.course_id`

        if (enrollment_id !== undefined) {
            params.push(enrollment_id);
            getEnrollmentsQuery += ` WHERE student_course.enrollment_id = ?`;
        }

        if (student_id !== undefined) {
            if (params.length > 0) {
                getEnrollmentsQuery += ` AND`;
            } else {
                getEnrollmentsQuery += ` WHERE`;
            }
            getEnrollmentsQuery += ` student_course.student_id = ?`
            params.push(student_id);
        }

        if (course_id !== undefined) {
            if (params.length > 0) {
                getEnrollmentsQuery += ` AND`;
            } else {
                getEnrollmentsQuery += ` WHERE`;
            }
            getEnrollmentsQuery += ` student_course.course_id = ?`
            params.push(course_id);
        }
        
        connection.query(getEnrollmentsQuery, params, (error, results) => {
            if (error) {
                console.log("Error getting enrollments: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            return res.status(200).json({enrollments: results})
        })

    } catch(error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getRegisteredCourses = (req, res) => {
    try {
        const {userData} = req;

        const studentId = userData.user_id;

        let getEnrollmentsQuery = `SELECT enrollment_id, student.name AS student_name, course_name, enrollment_date FROM student_course INNER JOIN student ON student_course.student_id = student.student_id INNER JOIN course ON student_course.course_id = course.course_id WHERE student_course.student_id = ?`;

        connection.query(getEnrollmentsQuery, [studentId], (error, results) => {
            if (error) {
                console.log("Error getting enrollments: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            return res.status(200).json({enrollments: results})
        })


    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = {registerCourse, updateStudentCourse, deleteStudentCourse, getAllEnrollments, getRegisteredCourses}