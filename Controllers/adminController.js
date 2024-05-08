const bcrypt = require("bcrypt");
const connection = require("../db/index.js");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../middleware/auth.js");


const adminRegister = async (req, res) => {
    try {
        let {name, email, username, password} = req.body;

        if (!name || !email || !username || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        username = username.toLowerCase();

        if (password.length < 8) {
            return res.status(400).json({message: "Your password must be at least 8 characters"});
        }

        const getAdminQuery = `SELECT * FROM admin WHERE username=?`;
        
        connection.query(getAdminQuery, [username], async (error, results) => {
            if (error) {
                console.log("Error retrieving admin: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }
            
            if (results.length !== 0) {
                return res.status(400).json({message: "Admin already exists"});
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);

                const createNewAdminQuery = `INSERT INTO admin(name, email, username, password) VALUES(?, ?, ?, ?)`;

                connection.query(createNewAdminQuery, [name, email, username, hashedPassword], (error, results) => {
                    if (error) {
                        console.log("Error creating new admin: ", error);
                        return res.status(500).json({message: "Internal Server Error"});
                    }
                    
                    return res.status(201).json({message: "Admin registered successfully"})
                })
            }
        })
    } catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

const adminLogin = async (req, res) => {
    try{
        let {username, password} = req.body;
        
        if (!username || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        username = username.toLowerCase();

        const getAdminQuery = `SELECT * FROM admin WHERE username=?`;

        connection.query(getAdminQuery, [username], async (error, results) => {
            if (error) {
                console.log("Error in admin login api: ", error);
                return res.status(500).json({message: "Internal Server Error"});
            }

            if (results.length === 0) {
                return res.status(400).json({message: "Invalid Username"});
            } else {
                const isPasswordMatched = await bcrypt.compare(password, results[0].password);

                if (isPasswordMatched) {
                    const payload = {
                        user_id: results[0].admin_id,
                        role: 'admin'
                    }

                    const jwtToken = jwt.sign(payload, SECRET, {expiresIn: '30d'});
                    return res.status(201).json({jwtToken: jwtToken});

                } else {
                    return res.status(400).json({message: "Invalid Password"});
                }
            }
        })


    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}


module.exports = {adminLogin, adminRegister}