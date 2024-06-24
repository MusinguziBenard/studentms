const db = require("../models");
const Student = db.students;
const StudentFinance = db.studentfinances;
const StudentPayment = db.studentpayments;
const Operation = db.Sequelize.Op;

// Retrieve all Students from the db
exports.GetAllStudents = (req, res) => {
    Student.findAll({
        include: [StudentFinance]
    })
    .then(data => {
        res.send({
            status: "Success",
            status_code: 1000,
            message: "Students successfully retrieved",
            number_of_students: data.length,
            results: data
        });
    })
    .catch(err => {
        res.status(500).send({
            status: "Error",
            status_code: 1001,
            message: err.message || "Error occurred while retrieving Students"
        });
    });
}

// Update a Student
exports.UpdateStudent = (req, res) => {
    if (req.method === "PUT") {
        const student_id = req.params.id;
        Student.update(req.body, { where: { student_id: student_id } })
        .then(data => {
            if (data == 1) {
                res.send({
                    status: "Success",
                    status_code: 100,
                    message: "Student Updated"
                });
            } else {
                res.send({
                    status: "Error",
                    status_code: 100,
                    message: "Student Not Updated"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While updating a student"
            });
        });
    } else {
        res.status(405).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });
    }
}

// Create a Student
exports.CreateStudent = (req, res) => {
    if (req.method === "POST") {
        const requiredFields = ['first_name', 'last_name', 'school_fees_amount', 'age', 'parent_phone_number', 'gender', 'category'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                res.status(400).send({
                    status: "Error",
                    status_code: 10012,
                    message: `${field.replace('_', ' ')} is required`
                });
                return;
            }
        }

        const student_data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            class: req.body.class,
            age: req.body.age,
            parent_phone_number: req.body.parent_phone_number,
            gender: req.body.gender,
            physical_address: req.body.physical_address,
            category: req.body.category,
            status: req.body.status
        };

        Student.create(student_data)
        .then(async data => {
            await StudentFinance.create({
                student_id: data.student_id,
                school_fees_amount: req.body.school_fees_amount
            });

            res.send({
                status: "Success",
                status_code: 100,
                message: "Student Added",
                result: data
            });
        })
        .catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While adding a student"
            });
        });
    } else {
        res.status(405).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });
    }
}

// Delete a Student
exports.DeleteStudent = async (req, res) => {
    if (req.method === "DELETE") {
        const student_id = req.params.id;
        const student_id_db = await Student.findByPk(student_id);

        if (student_id_db === null) {
            res.status(404).send({
                status: "Error",
                status_code: 100,
                message: "Student ID passed Not in the Database"
            });
            return;
        }

        Student.destroy({ where: { student_id: student_id } })
        .then(data => {
            if (data == 1) {
                res.send({
                    status: "Success",
                    status_code: 100,
                    message: "Student Deleted"
                });
            } else {
                res.send({
                    status: "Error",
                    status_code: 100,
                    message: "Student Not Deleted"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While deleting a student"
            });
        });
    } else {
        res.status(405).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });
    }
}

// Search Student
exports.SearchStudent = (req, res) => {
    const search_query = req.query.first_name;
    const condition = search_query ? { first_name: { [Operation.like]: `%${search_query}%` } } : null;

    Student.findAll({ where: condition })
    .then(data => {
        res.send({
            status: "Success",
            status_code: 1000,
            message: "Students successfully retrieved",
            number_of_students: data.length,
            results: data
        });
    })
    .catch(err => {
        res.status(500).send({
            status: "Error",
            status_code: 1001,
            message: err.message || "Error occurred while searching Students"
        });
    });
}

// Get Student Finances
exports.GetStudentFinances = (req, res) => {
    StudentFinance.findAll({
        include: [Student]
    })
    .then(async data => {
        const total_expected = await StudentFinance.findAll({
            attributes: [
                [db.Sequelize.fn('sum', db.Sequelize.col('school_fees_amount')), 'total']
            ],
            raw: true
        });

        res.send({
            status: "Success",
            status_code: 1000,
            message: "Student Finances successfully retrieved",
            number_of_students: data.length,
            total_expected: total_expected[0]['total'],
            results: data
        });
    })
    .catch(err => {
        res.status(500).send({
            status: "Error",
            status_code: 1001,
            message: err.message || "Error occurred while retrieving Student Finances"
        });
    });
}

// Make a Payment
exports.MakePayment = async (req, res) => {
    if (req.method === "POST") {
        const student_id_dbx = await Student.findByPk(req.body.student_id);

        if (student_id_dbx === null) {
            res.status(404).send({
                status: "Error",
                status_code: 100,
                message: "Student ID passed Not in the Database"
            });
            return;
        }

        if (!req.body.amount_paid) {
            res.status(400).send({
                status: "Error",
                status_code: 10013,
                message: "Amount Paid is required"
            });
            return;
        }

        const payment_data = {
            amount_paid: req.body.amount_paid,
            student_id: req.body.student_id
        };

        StudentPayment.create(payment_data)
        .then(data => {
            res.send({
                status: "Success",
                status_code: 100,
                message: "Student Payment Added",
                result: data
            });
        })
        .catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While adding a student payment"
            });
        });
    } else {
        res.status(405).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });
    }
}

// Retrieve all Payments
exports.TotalPayments = (req, res) => {
    StudentPayment.findAll({
        include: [Student]
    })
    .then(async data => {
        const total_payments_received = await StudentPayment.findAll({
            attributes: [
                [db.Sequelize.fn('sum', db.Sequelize.col('amount_paid')), 'total']
            ],
            raw: true
        });

        res.send({
            status: "Success",
            status_code: 1000,
            message: "Student Payments successfully retrieved",
            number_of_students: data.length,
            total_payments_received: total_payments_received[0]['total'],
            results: data
        });
    })
    .catch(err => {
        res.status(500).send({
            status: "Error",
            status_code: 1001,
            message: err.message || "Error occurred while retrieving Student Payments"
        });
    });
}

// Get Student Balances
exports.FeesBalance = (req, res) => {
    if (req.method === "GET") {
        StudentFinance.findAll()
        .then(data => {
            res.send({
                status: "Success",
                status_code: 100,
                message: "Student Balances",
                result: data
            });
        })
        .catch(err => {
            res.status(500).send({
                status: "Error",
                status_code: 101,
                message: err.message || "Error Occurred While fetching student balances"
            });
        });
    } else {
        res.status(405).send({
            status: "Error",
            status_code: 1011,
            message: "METHOD NOT ALLOWED"
        });
    }
}
