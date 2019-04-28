const express = require('express');
const router = express.Router();

const Company = require('../models/company');

module.exports = router;

router.get("/:companyName", (req, res, next) => {
    Company.findOne({name: {'$regex': req.params.companyName,$options:'i'}})
      .exec()
      .then(company => {
        if (!company) {
          return res.status(404).json({
            message: "Company not found"
          });
        }
        res.status(200).json({
          company: company
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });

router.post("/", (req, res, next) => {

    const company = new Company({
      name: req.body.name,
      description: req.body.description,
      numVacancies: req.body.numVacancies
    });
    company
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Company registered for the placement drive!",
          createdCompany: result
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

router.delete("/:name", (req, res, next) => {
    Company.remove({ name: req.params.name })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Company unregistered for the drive!"
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });

module.exports = router;