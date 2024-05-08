const connection = require("../db/index.js");

const paymentDetail = (req, res) => {
    try {
        const {student_id, payment_date, amount_paid, payment_method} = req.body;

        if (!student_id || !payment_date || !amount_paid || !payment_method) {
            return res.status(400).json({message: "All fields are required"});
        }

        const checkStudentIdQuery = `SELECT * FROM student WHERE student_id = ?`

        connection.query(checkStudentIdQuery, [student_id], (error, results) => {
            if (error) {
                console.log("Error validating student id for payment: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }
                
            if (results.length === 0) {
                return res.status(400).json({message: "Invalid student"});
            } else {
                const insertPaymentQuery = `INSERT INTO payment (student_id, payment_date, amount_paid, payment_method)
                                            VALUES (?, ?, ?, ?)`;

                
                connection.query(insertPaymentQuery, [student_id, payment_date, amount_paid, payment_method], (error, results) => {
                    if (error) {
                        console.log("Error adding payment details: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    return res.status(201).json({message: "Payment details registered successfully"})
                })
            }  
        })

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const eventPayment = (req, res) => {
    try { 
        const {student_id, event_id, pay_date, amount_paid} = req.body;

        if (!student_id || !event_id || !pay_date || !amount_paid) {
            return res.status(400).json({message: "All fields are required"});
        }

        const checkStudentIdQuery = `SELECT * FROM student WHERE student_id = ?`

        connection.query(checkStudentIdQuery, [student_id], (error, results) => {
            if (error) {
                console.log("Error validating student id for event payment: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid student"});
            } else {
                const insertPaymentQuery = `INSERT INTO event_payment (student_id, event_id, pay_date, amount_paid)
                                            VALUES (?, ?, ?, ?)`;
                
                connection.query(insertPaymentQuery, [student_id, event_id, pay_date, amount_paid], (error, results) => {
                    if (error) {
                        console.log("Error adding event payment details: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    return res.status(201).json({message: "Payment details registered successfully"})
                })
            }
        })


    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const updateEventPayment = (req, res) => {
    try {
        const {paymentId} = req.params;
 
        const {student_id, event_id, pay_date, amount_paid} = req.body;

        if (!student_id || !event_id || !pay_date || !amount_paid) {
            return res.status(400).json({message: "All fields are required"});
        }

        const checkPaymentIdQuery = `SELECT * FROM event_payment WHERE payment_id = ?`;

        connection.query(checkPaymentIdQuery, [paymentId], (error, results) => {
            if (error) {
                console.log("Error validating payment id for updation: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid payment id"});
            } else {
                const updatePaymentDetailQuery =   `UPDATE event_payment SET ? WHERE payment_id = ?`;

                const updatedFields = req.body;

                connection.query(updatePaymentDetailQuery, [updatedFields, paymentId], (error, results) => {
                    if (error) {
                        console.log("Error updating payment details: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    if (results.affectedRows === 1) {
                        return res.status(201).json({message: 'Payment details updated successfully'});
                    }
                })
            }
        })


    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const updatePaymentDetail = (req, res) => {
    try {
        const {paymentId} = req.params;
        
        const {student_id, payment_date, amount_paid, payment_method} = req.body;

        if (!student_id || !payment_date || !amount_paid || !payment_method) {
            return res.status(400).json({message: "All fields are required"});
        }

        const checkPaymentIdQuery = `SELECT * FROM payment WHERE payment_id = ?`;

        connection.query(checkPaymentIdQuery, [paymentId], (error, results) => {
            if (error) {
                console.log("Error validating payment id for updation: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid payment id"});
            } else {
                const updatePaymentDetailQuery =   `UPDATE payment SET ? WHERE payment_id = ?`;

                const updatedFields = req.body;

                connection.query(updatePaymentDetailQuery, [updatedFields, paymentId], (error, results) => {
                    if (error) {
                        console.log("Error updating payment details: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    if (results.affectedRows === 1) {
                        return res.status(201).json({message: 'Payment details updated successfully'});
                    }
                })
            }
        })

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const deletePaymentDetail = (req, res) => {
    try {
        const {payment_id} = req.body;

        const checkPaymentIdQuery = `SELECT * FROM payment WHERE payment_id = ?`;

        connection.query(checkPaymentIdQuery, [payment_id], (error, results) => {
            if (error) {
                console.log("Error validating payment id: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid payment id"}); 
            } else {
                const deletePaymentQuery =  `DELETE FROM payment WHERE payment_id = ?`;

                connection.query(deletePaymentQuery, [payment_id], (error, results) => {
                    if (error) {
                        console.log("Error deleting payment detail: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    return res.status(200).json({message: "Payment detail deleted successfully"})
                })
            }
        })
    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }


}

const deleteEventPayment = (req, res) => {
    try {
        const {payment_id} = req.body;

        const checkPaymentIdQuery = `SELECT * FROM event_payment WHERE payment_id = ?`;

        connection.query(checkPaymentIdQuery, [payment_id], (error, results) => {
            if (error) {
                console.log("Error validating payment id: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid payment id"}); 
            } else {
                const deletePaymentQuery =  `DELETE FROM event_payment WHERE payment_id = ?`;

                connection.query(deletePaymentQuery, [payment_id], (error, results) => {
                    if (error) {
                        console.log("Error deleting event payment detail: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    return res.status(200).json({message: "Payment detail deleted successfully"})
                })
            }
        })



    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getPaymentDetails = (req, res) => {
    try {
        let {payment_id=undefined, student_id=undefined, payment_date=undefined} = req.query;

        let params = []

        let getPaymentQuery = 'SELECT payment.payment_id, student.name AS student_name, payment.payment_date, payment.amount_paid, payment.payment_method FROM payment INNER JOIN student ON payment.student_id = student.student_id';

        if (payment_id !== undefined) {
            params.push(payment_id);
            getPaymentQuery += ' WHERE payment.payment_id = ?';
        }

        if (student_id !== undefined) {
            if (params.length > 0) {
                getPaymentQuery += ' AND';
            } else {
                getPaymentQuery += ' WHERE';
            }
            getPaymentQuery += ' payment.student_id = ?'
            params.push(student_id);
        }

        if (payment_date !== undefined) {
            if (params.length > 0) {
                getPaymentQuery += ' AND';
            } else {
                getPaymentQuery += ' WHERE';
            }
            getPaymentQuery += ' payment.payment_date = ?'
            params.push(payment_date);
        }

        console.log(getPaymentQuery)
        connection.query(getPaymentQuery, params, (error, results) => {
            if (error) {
                console.log("Error getting payment details: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            return res.status(200).json({payments: results})
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getEventPaymentDetails = (req, res) => {
    try {
        const {payment_id=undefined, student_id=undefined, event_id=undefined} = req.query;

        let params = [];

        let getPaymentQuery = 'SELECT event_payment.payment_id, student.name AS student_name, event_payment.event_id , event_payment.amount_paid FROM event_payment INNER JOIN student ON event_payment.student_id = student.student_id';

        if (payment_id !== undefined) {
            params.push(payment_id);
            getPaymentQuery += ' WHERE event_payment.payment_id = ?';
        }

        if (student_id !== undefined) {
            if (params.length > 0) {
                getPaymentQuery += ' AND';
            } else {
                getPaymentQuery += ' WHERE';
            }
            getPaymentQuery += ' event_payment.student_id = ?'
            params.push(student_id);
        }

        if (event_id !== undefined) {
            if (params.length > 0) {
                getPaymentQuery += ' AND';
            } else {
                getPaymentQuery += ' WHERE';
            }
            getPaymentQuery += ' event_payment.event_id = ?'
            params.push(event_id);
        }

        connection.query(getPaymentQuery, params, (error, results) => {
            if (error) {
                console.log("Error getting payment details: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            return res.status(200).json({payments: results})
        })

    }  catch(error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = {paymentDetail, eventPayment, updateEventPayment, updatePaymentDetail, deleteEventPayment, deletePaymentDetail, getPaymentDetails, getEventPaymentDetails}