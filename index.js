const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

const adminRoutes = require("./routes/admin");
const studentRoutes = require("./routes/student");


const trimRequestBody = require("./middleware/trimBody");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(trimRequestBody);


app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})
