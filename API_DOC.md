📚 API Endpoints
----------------

### 🔐 Admin Routes – /api/admin

#### Auth

*   POST /register – Register as admin
    
*   POST /login – Admin login
    

#### Students

*   POST /register-student – Register a new student
    
*   PUT /update-student/:studentId – Update student info
    
*   GET /students – Get all students
    
*   GET /students/:studentId – Get specific student
    
*   POST /create-credentials – Add student login credentials
    
*   GET /student-credentials – View all student credentials
    
*   DELETE /delete-student-credentials – Delete student credentials
    

#### Courses

*   POST /create-course – Create a course
    
*   PUT /update-course/:courseId – Update a course
    
*   DELETE /delete-course – Delete a course
    
*   GET /courses – Get all courses
    

#### Enrollments

*   POST /register-course/:studentId – Enroll student in course
    
*   PUT /update-student-course/:enrollmentId – Update enrollment
    
*   DELETE /delete-enrollment – Delete enrollment
    
*   GET /enrollments – View all enrollments
    

#### Events

*   POST /create-event – Create a new event
    
*   PUT /update-event/:eventId – Update an event
    
*   DELETE /delete-event – Delete an event
    
*   GET /events – Get all events
    

#### Event Payments

*   POST /event-payment – Register event payment
    
*   PUT /update-event-payment/:paymentId – Update event payment
    
*   DELETE /delete-event-payment-detail – Delete event payment
    
*   GET /event-payment-details – Get event payment details
    

#### Payment Details

*   POST /payment-detail – Add payment detail
    
*   PUT /update-payment/:paymentId – Update payment
    
*   DELETE /delete-payment-detail – Delete payment detail
    
*   GET /payment-details – Get all payment details
    

#### Certificates

*   POST /upload-certificate – Upload a certificate (JPEG only)
    
*   PUT /update-certificate/:certificateId – Update certificate
    
*   DELETE /delete-certificate – Delete certificate
    
*   GET /all-certificates – Get all certificates
    
*   GET /certificate/:certificateId – View a certificate
    

### 👨‍🎓 Student Routes – /api/student

*   POST /login – Student login
    
*   GET /student-detail – Get student profile
    
*   GET /student-credential – Get student credentials
    
*   PUT /update-credential – Update student credential
    
*   GET /enrollments – View enrolled courses
    
*   GET /events – View active events
