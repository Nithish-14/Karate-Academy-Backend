const express = require("express");
const multer = require("multer");
const router = express.Router();


const { authenticateJwt } = require("../middleware/auth.js");
const verifyUser = require("../middleware/verifyUser.js");
const delCertificate = require("../middleware/delCertificate.js");

const {adminRegister, adminLogin} = require("../Controllers/adminController.js");
const {studentRegister, addCredentials, updateStudent, deleteStudentCredential, getAllStudents, getAllStudentCredentials, getStudentDetail} = require("../Controllers/studentController.js");
const {paymentDetail, eventPayment, updateEventPayment, updatePaymentDetail, deleteEventPayment, deletePaymentDetail, getPaymentDetails, getEventPaymentDetails} = require("../Controllers/paymentController.js");
const {createCourse, updateCourse, deleteCourse, getAllCourses} = require("../Controllers/courseController.js");
const {registerCourse, updateStudentCourse, deleteStudentCourse, getAllEnrollments} = require("../Controllers/enrollmentController.js");
const {uploadCertificate, updateCertificate, deleteCertificate, getAllCertificates, getCertificate} = require("../Controllers/certificateController.js");
const {createEvent, updateEvent, deleteEvent, getAllEvents} = require("../Controllers/eventController.js");


//Multer Configurations
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './media');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/jpeg') { // Check if file is JPEG image
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only JPG files are allowed')); // Reject the file
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter, 
    limits: {
        fileSize: 2097152 //2MB limit
    }
})


//Admin Register API
router.post("/register", adminRegister);

//Admin Login API
router.post("/login", adminLogin);

//Register Student API
router.post("/register-student", authenticateJwt, verifyUser, studentRegister);

//Create Student Credentials API
router.post("/create-credentials", authenticateJwt, verifyUser, addCredentials)

//Register Payment-Details API
router.post("/payment-detail", authenticateJwt, verifyUser, paymentDetail);

//Create Course API
router.post("/create-course", authenticateJwt, verifyUser, createCourse);

//Register Course API
router.post("/register-course/:studentId", authenticateJwt, verifyUser, registerCourse);

//Upload Certificate API
router.post("/upload-certificate", authenticateJwt, verifyUser, upload.single('image'), uploadCertificate);

//Create Event API
router.post("/create-event", authenticateJwt, verifyUser, upload.single('image'), createEvent);

//Register Event Payment Detail API
router.post("/event-payment", authenticateJwt, verifyUser, eventPayment);

//Update Student API
router.put("/update-student/:studentId", authenticateJwt, verifyUser, updateStudent);

//Update Payment Details API
router.put("/update-payment/:paymentId", authenticateJwt, verifyUser, updatePaymentDetail);

//Update Course API
router.put("/update-course/:courseId", authenticateJwt, verifyUser, updateCourse);

//Update Student Course API
router.put("/update-student-course/:enrollmentId", authenticateJwt, verifyUser, updateStudentCourse);

//Update Certificate API
router.put("/update-certificate/:certificateId", authenticateJwt, verifyUser, upload.single('image'), updateCertificate);

//Update Event API
router.put("/update-event/:eventId", authenticateJwt, verifyUser, upload.single('image'), updateEvent);

//Update Event Payment API
router.put("/update-event-payment/:paymentId", authenticateJwt, verifyUser, updateEventPayment);

//Delete Student Credentials API
router.delete("/delete-student-credentials", authenticateJwt, verifyUser, deleteStudentCredential);

//Delete Payment Detail API
router.delete("/delete-payment-detail", authenticateJwt, verifyUser, deletePaymentDetail);

//Delete Course API
router.delete("/delete-course", authenticateJwt, verifyUser, deleteCourse);

//Delete Student Course API
router.delete("/delete-enrollment", authenticateJwt, verifyUser, deleteStudentCourse);

//Delete Certificate API
router.delete("/delete-certificate", authenticateJwt, verifyUser, delCertificate , deleteCertificate);

//Delete Event API
router.delete("/delete-event", authenticateJwt, verifyUser, deleteEvent);

//Delete Event Payment API
router.delete("/delete-event-payment-detail", authenticateJwt, verifyUser, deleteEventPayment);

//Get All Students API
router.get("/students", authenticateJwt, verifyUser, getAllStudents);

//Get Specific Student Detail API
router.get("/students/:studentId", authenticateJwt, verifyUser, getStudentDetail); 

//Get All Student Credentials
router.get("/student-credentials", authenticateJwt, verifyUser, getAllStudentCredentials);

//Get All Payment Details API
router.get("/payment-details", authenticateJwt, verifyUser, getPaymentDetails);

//Get All Courses API
router.get("/courses", authenticateJwt, getAllCourses);

//Get All Certificates API
router.get("/all-certificates", authenticateJwt, verifyUser, getAllCertificates);

//Get Certificate File API
router.get("/certificate/:certificateId", authenticateJwt, verifyUser, getCertificate);

//Get Event Payment Details API
router.get("/event-payment-details", authenticateJwt, verifyUser, getEventPaymentDetails);

//Get Enrollments API
router.get("/enrollments", authenticateJwt, verifyUser, getAllEnrollments);

//Get All Events API
router.get("/events", authenticateJwt, verifyUser, getAllEvents);


module.exports = router;
