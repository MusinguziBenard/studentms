module.exports = app => {
    // importing a student controller
    const student_controller = require("../controllers/student.controller");

    // import Router interface from express module
    var router = require("express").Router();

    // route to fetch all students
    router.get("/getstudents", student_controller.GetAllStudents);

    // route to update a specific Student
    router.put("/updatestudent/:id", student_controller.UpdateStudent);

    // route to delete a specific Student
    router.delete("/deletestudent/:id", student_controller.DeleteStudent);

    // route to add a specific Student
    router.post("/addstudent", student_controller.CreateStudent);

    // route to search a specific student by first name
    router.get("/findstudent", student_controller.SearchStudent);

    // route to get finances of all students
    router.get("/getstudentfinances", student_controller.GetStudentFinances);

    // route to make payment
    router.post("/makepayment", student_controller.MakePayment);

    // route to get total payments
    router.get("/totalpayments", student_controller.TotalPayments);

    // route to get fees balances
    router.get("/feesbalances", student_controller.FeesBalance);

    // define the base route
    app.use('/api/studentms2', router);
}
