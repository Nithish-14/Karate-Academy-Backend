const express = require("express");
const router = express.Router();

const { authenticateJwt } = require("../middleware/auth.js");
const verifyStudent = require("../middleware/verifyStudent.js");

const {studentLogin, studentInfo, studentCredential, updateStudentCredential} = require("../Controllers/studentController.js");
const {getRegisteredCourses} = require("../Controllers/enrollmentController.js");
const {getAllActiveEvents} = require("../Controllers/eventController.js");


//Student Login API
router.post("/login", studentLogin);

//Student Detail API
router.get("/student-detail", authenticateJwt, verifyStudent, studentInfo);

//Get Student Credentials API
router.get("/student-credential", authenticateJwt, verifyStudent, studentCredential);

//Update Student Credential API
router.put("/update-credential", authenticateJwt, verifyStudent, updateStudentCredential);

//Get Registered Course API
router.get("/enrollments", authenticateJwt, verifyStudent, getRegisteredCourses);

//Get Active Events API
router.get("/events", authenticateJwt, verifyStudent, getAllActiveEvents);


module.exports = router;