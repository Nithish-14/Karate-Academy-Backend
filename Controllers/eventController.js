const connection = require("../db/index.js");
const fs = require("fs").promises;

const createEvent = async (req, res) => {
    try {

        //event_active should be true!!!
        let {event_payment, event_start_date, event_end_date, event_media, event_price=0, event_active=1} = req.body;

        if (event_payment === 1 || event_payment === 'true' || event_payment === true) {
            event_payment = 1
        } else {
            event_payment = 0
        }

        event_active = 1

        if (!event_start_date || !event_end_date || !event_media) {
            return res.status(400).json({message: "All fields are required"});
        }
        
        const file = req.file;

        if (!file) {
            return res.status(400).json({message: "No file uploaded"});
        }

        const imageBuffer = await fs.readFile(file.path);

        const createNewEventQuery = `INSERT INTO events (event_payment, event_start_date, event_end_date, event_media, event_photo, event_price, event_active)
                                    VALUES (?, ?, ?, ?, ?, ?, ?)`;

        connection.query(createNewEventQuery, [event_payment, event_start_date, event_end_date, event_media, imageBuffer, event_price, event_active], async (error, results) => {
            if (error) {
                console.log("Error creating new event: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }
            
            await fs.unlink(file.path);
            if (results.affectedRows === 1) {
                return res.status(201).json({message: 'Event created successfully', event_id: results.insertId});
            }
        })

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
} 

const updateEvent = async (req, res) => {
    try {
        const {eventId} = req.params;

        let {event_payment, event_start_date, event_end_date, event_media, event_price=0, event_active=1} = req.body;

        if (event_payment === 1 || event_payment === 'true' || event_payment === true) {
            event_payment = 1
        } else {
            event_payment = 0
        }

        if (event_active === 1 || event_active === 'true' || event_active === true) {
            event_active = 1
        } else {
            event_active = 0;
        }

        if (!event_start_date || !event_end_date || !event_media) {
            return res.status(400).json({message: "All fields are required"});
        }

        const file = req.file;

        let imageBuffer;
        
        if (event_active === 1) {
            if (!file) {
                return res.status(400).json({message: "No file uploaded"});
            }

            imageBuffer = await fs.readFile(file.path);
        }

        if (event_active === 0) {
            imageBuffer = null;
        }

        const checkEventIdQuery = `SELECT * FROM events WHERE event_id = ?`;

        connection.query(checkEventIdQuery, [eventId], (error, results) => {
            if (error) {
                console.log("Error validating event id for updation: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid event id"});
            } else {
                const updateEventQuery = `UPDATE events SET event_payment = ?, event_start_date = ?, event_end_date = ?, event_media = ?, event_photo = ?, event_price = ?, event_active = ? WHERE event_id = ?`;

                connection.query(updateEventQuery, [event_payment, event_start_date, event_end_date, event_media, imageBuffer, event_price, event_active, eventId], async (error, results) => {
                    if (error) {
                        console.log("Error updating event: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }
                     

                    if (event_active === 1 || file) {
                        await fs.unlink(file.path);
                    }
    
                    if (results.affectedRows === 1) {
                        return res.status(201).json({message: 'Event updated successfully'});
                    }
                })
            }
        })

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const deleteEvent = (req, res) => {
    try {
        const {event_id} = req.body;

        const checkEventIdQuery = `SELECT * FROM events WHERE event_id = ?`;

        connection.query(checkEventIdQuery, [event_id], (error, results) => {
            if (error) {
                console.log("Error validating event id: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid event"}); 
            } else {
                const deleteEventQuery =  `DELETE FROM events WHERE event_id = ?`;

                connection.query(deleteEventQuery, [event_id], (error, results) => {
                    if (error) {
                        console.log("Error deleting event: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }

                    return res.status(200).json({message: "Event deleted successfully"})
                })
            }
        })

    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getAllEvents = (req, res) => {
    try {
        const getEventsQuery = `SELECT * FROM events`;

        connection.query(getEventsQuery, (error, results) => {
            if (error) {
                console.log("Error getting events: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            return res.status(200).json({events: results})
        })


    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const getAllActiveEvents = (req, res) => {
    try {
        const getEventsQuery = `SELECT * FROM events WHERE event_active = 1`;

        connection.query(getEventsQuery, (error, results) => {
            if (error) {
                console.log("Error getting events: ", error)
                return res.status(500).json({message: 'Internal Server Error'})
            }

            return res.status(200).json({events: results})
        })


    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = {createEvent, updateEvent, deleteEvent, getAllEvents, getAllActiveEvents}    