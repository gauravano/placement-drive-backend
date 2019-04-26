const express = require('express');
const router = express.Router();

const Student = require('../models/student');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Students are fetched'
    });
});

router.post("/", (req, res, next) => {
    console.log("Helloooooo", req.body);

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
  

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});


module.exports = router;