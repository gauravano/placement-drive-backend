const express = require('express');
const router = express.Router();

const Student = require('../models/student');
const Registration = require('../models/registration');
const Company = require('../models/company');

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

  router.post("/register", (req, res, next) => {
    const companyName = req.body.companyName;
    const rollno = req.body.rollno;

   Student.findOne({rollno: req.body.rollno}, (err, student) => {
        if (err) {
            console.log("some");
            res.status(400).json({
              error: err
            });
          }else if(student != null){
            Company.findOne({name: companyName}, (err, company) => {
                console.log("company result: ", company);
                if(err){
                    console.log("::hhhh");
                    res.status(400).json({
                        error: err
                    });
                }else if(company != null){
                    Registration.findOne({companyName: companyName, rollno: rollno}, (err, entry) => {
                        if(err){
                            res.status(400).json({
                                error: err
                            });    
                        }else if(entry != null){
                            res.status(200).json({
                                message: "Already registered for the company!"
                            })
                        }else{
                            const newEntry = new Registration({ 
                                companyName: companyName,
                                rollno: rollno
                              });
                              newEntry
                                .save()
                                .then(result => {
                                  console.log(result);
                                  res.status(201).json({
                                    message: "Registration Successful!",
                                    createdEntry: result
                                  });
                                })
                                .catch(err => {
                                  console.log(err);
                                  res.status(500).json({
                                    error: err
                                  });
                                });
                        } 
                    })    
                }else{
                    res.status(404).json({
                        error: "Company with given name doesn't exist!"
                    })
                }                
            })
          }else{
            res.status(404).json({
                error: "Student with given roll number doesn't exist!"
            })
          }
          
   });
  });

  router.delete("/unregister", (req, res, next) => {
    const companyName = req.body.companyName;
    const rollno = req.body.rollno;

   Student.findOne({rollno: req.body.rollno}, (err, student) => {
        if (err) {
            console.log("some");
            res.status(400).json({
              error: err
            });
          }else if(student != null){
            Company.findOne({name: companyName}, (err, company) => {
                console.log("company result: ", company);
                if(err){
                    console.log("::hhhh");
                    res.status(400).json({
                        error: err
                    });
                }else if(company != null){
                    Registration.findOneAndDelete({companyName: companyName, rollno: rollno}, (err, entry) => {
                        if(err){
                            res.status(400).json({
                                error: err
                            });    
                        }else if(entry != null){
                            res.status(200).json({
                                message: `Successfully unregistered for the drive with the ${companyName}`,
                                deletedEntry: entry
                            })
                        }else{
                            res.status(400).json({
                                error: "No registration found for given records!"
                            })
                        } 
                    })    
                }else{
                    res.status(404).json({
                        error: "Company with given name doesn't exist!"
                    })
                }                
            })
          }else{
            res.status(404).json({
                error: "Student with given roll number doesn't exist!"
            })
          }
          
   });
  });


router.put("/:rollno", (req, res, next) => {
    const rollno = req.params.rollno;
    
    Student.findOneAndUpdate({ rollno },
        req.body,
        { new: true },
        (err, student) => {
        if (err) {
          res.status(400).json({
            error: err
          });
        }
        res.json(student);
      });
});

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