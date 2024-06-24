// import modules
const express = require("express");

// helps to parse the json requests and create request objects
const bodyParser = require("body-parser");

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// importing models
const db = require("./models");

db.sequelize_config.sync(
    { force: false }
).then(
    () => { console.log("DB synchronised") }
);

// API Routes
app.get("/n", (req, res) => {
    res.json(
        {
            "status": "Success",
            "status_code": 100,
            "message": "Welcome to Student MS"
        }
    );
});

app.post("/data", (req, res) => {
    const data = req.body.data_r;
    if (!data) {
        res.json({
            "status": "Error",
            "status_code": 101,
            "message": "No Data is available",
        });
    } else {
        res.json(
            {
                "status": "Success",
                "status_code": 100,
                "message": "Welcome to Student MS",
                "data": `Result - ${data}`
            }
        );
    }
});

// import student routes
require("./routes/student.routes")(app);

// define port for project
const PORT = 8075;

// Monitor when server starts
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});






// my use cases summary

// /api/studentms2/getstudents
// /api/studentms2/updatestudent/:id
                    // {
                    //     "first_name": "John",
                    //     "last_name": "Doe",
                    //     "class": "5th",
                    //     "age": 12,
                    //     "parent_phone_number": "+256789090213",
                    //     "gender": "M",
                    //     "physical_address": "Kampala",
                    //     "category": "DAY",
                    //     "status": true
                    // }
  

// /api/studentms2/getstudents
// /api/studentms2/deletestudent/:id
// /api/studentms2/addstudent
                    // {
                    //     "first_name": "Jane",
                    //     "last_name": "Doe",
                    //     "class": "4th",
                    //     "age": 10,
                    //     "parent_phone_number": "+256789090213",
                    //     "gender": "F",
                    //     "physical_address": "Kampala",
                    //     "category": "BOARDING",
                    //     "status": true,
                    //     "school_fees_amount": 500000
                    // }
  
// /api/studentms2/findstudent?first_name=<name>
// /api/studentms2/getstudentfinances
// /api/studentms2/makepayment
                    // {
                    //     "student_id": 2,
                    //     "amount_paid": 300000
                    // }
// /api/studentms2/totalpayments









