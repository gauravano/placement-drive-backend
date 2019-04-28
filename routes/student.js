const express = require('express');
const router = express.Router();

const Student = require('../models/student');
const Registration = require('../models/registration');

router.get("/:rollno", (req, res, next) => {
    Student.findOne({rollno: req.params.rollno})
      .then(student => {
        if (!student) {
          return res.status(404).json({
            message: "Student not found!"
          });
        }
        res.status(200).json({
          student: student
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });

router.post("/", (req, res, next) => {
    const student = new Student({ 
      name: req.body.name,
      department: req.body.department,
      rollno: req.body.rollno,
      cgpa: req.body.cgpa
    });
    student
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Handling POST requests to /student",
          createdStudent: result
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

  router.post("/registration", (req, res, next) => {
    const companyName = req.body.companyName;
    const rollno = req.body.rollno;

    const student = new Student({ 
      name: req.body.name,
      department: req.body.department,
      rollno: req.body.rollno,
      cgpa: req.body.cgpa
    });
    student
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Handling POST requests to /student",
          createdStudent: result
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });


// router.put("/:rollno", (req, res, next) => {
//     const rollno = req.params.rollno;
    
//     Student.findOneAndUpdate({ rollno },
//         req.body,
//         { new: true },
//         (err, student) => {
//         if (err) {
//           res.status(400).json({
//             error: err
//           });
//         }
//         res.json(student);
//       });
// });

router.delete("/:rollno", (req, res, next) => {
    Student.remove({ rollno: req.params.rollno })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Student deleted"
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });

module.exports = router;