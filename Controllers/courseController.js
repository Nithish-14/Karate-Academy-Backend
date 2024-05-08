const connection = require("../db/index.js");

const createCourse = (req, res) => {
    try {
        const {course_name, instructor, schedule, category} = req.body;

        if (!course_name || !instructor || !schedule || !category) {
            return res.status(400).json({message: "All fields are required"});
        } 

        const checkCourseExistQuery = `SELECT * FROM course WHERE course_name = ?`;

        connection.query(checkCourseExistQuery, [course_name], (error, results) => {
            if (error) {
                console.log("Error checking course existence: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }
        
            if (results.length !== 0) {
                return res.status(400).json({message: "Course already exists"});
            } else {
                const createNewCourse = `INSERT INTO course (course_name, instructor, schedule, category)
                                         VALUES (?, ?, ?, ?)`;

                connection.query(createNewCourse, [course_name, instructor, schedule, category], (error, results) => {
                    if (error) {
                        console.log("Error creating new course: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    if (results.affectedRows === 1) {
                        return res.status(201).json({message: 'Course created successfully'});
                    }
                })
            }
        })
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const updateCourse = (req, res) => {
    try {
        const {courseId} = req.params;

        const {course_name, instructor, schedule, category} = req.body;

        if (!course_name || !instructor || !schedule || !category) {
            return res.status(400).json({message: "All fields are required"});
        }
        
        const checkCourseIdQuery = `SELECT * FROM course WHERE course_id = ?`;

        connection.query(checkCourseIdQuery, [courseId], (error, results) => {
            if (error) {
                console.log("Error validating course id for updation: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid course id"});
            } else {
                const updateCourseDetailQuery =   `UPDATE course SET ? WHERE course_id = ?`;

                const updatedFields = req.body;

                connection.query(updateCourseDetailQuery, [updatedFields, courseId], (error, results) => {
                    if (error) {
                        console.log("Error updating course details: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    if (results.affectedRows === 1) {
                        return res.status(201).json({message: 'Course details updated successfully'});
                    }
                })

            }
        })

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const deleteCourse = (req, res) => {
    try {
        const {course_id} = req.body;

        const checkCourseIdQuery = `SELECT * FROM course WHERE course_id = ?`;

        connection.query(checkCourseIdQuery, [course_id], (error, results) => {
            if (error) {
                console.log("Error validating course id: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid course"}); 
            } else {
                const deleteCourseQuery =  `DELETE FROM course WHERE course_id = ?`;

                connection.query(deleteCourseQuery, [course_id], (error, results) => {
                    if (error) {
                        console.log("Error deleting course: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    return res.status(200).json({message: "Course deleted successfully"})
                })
            }
        })


    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getAllCourses = (req, res) => {
    try {
        const getCoursesQuery = `SELECT * FROM course`;

        connection.query(getCoursesQuery, (error, results) => {
            if (error) {
                console.log("Error getting courses: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            return res.status(200).json({courses: results})
        })

    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = {createCourse, updateCourse, deleteCourse, getAllCourses}