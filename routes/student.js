const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const winston = require('winston');

const transports = {
  console: new winston.transports.Console({ level: 'warn' }),
  file: new winston.transports.File({ filename: 'combined.log', level: 'error' })
};

const logger = winston.createLogger({
  transports: [
    transports.console,
    transports.file
  ]
});

const Student = require('../models/student');
const Registration = require('../models/registration');
const Company = require('../models/company');

router.get("/:rollno", [
  check('rollno').exists().isInt()
] ,(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Bad request", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
  
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

router.post("/", [
  check('rollno').exists().isInt(),
  check('rollno').custom(value => {
    return Student.findOne({rollno: value}).then(student => {
      if (student) {
        return Promise.reject('Student with same roll number already exists!');
      }
    });
  }), 
  check('name').exists().isString().trim(),
  check('cgpa').optional().isNumeric(),
  check('department').optional().isString().trim()
],(req, res, next) => {
  
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }  
  
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
          message: "Student successfully created!",
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

  router.post("/register", [
    check('rollno').exists().isInt(), 
    check('companyName').exists().isString().trim()
  ] ,(req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }  
  
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

  router.delete("/unregister", [
    check('rollno').exists().isInt(), 
    check('companyName').exists().isString().trim()
  ] ,(req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }  

    const companyName = req.body.companyName;
    const rollno = req.body.rollno;

   Student.findOne({rollno: req.body.rollno}, (err, student) => {
        if (err) {
            res.status(400).json({
              error: err
            });
          }else if(student != null){
            Company.findOne({name: companyName}, (err, company) => {
                if(err){
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


router.put("/:rollno", [
  check('rollno').exists().isInt(),
  check('rollno').custom(value => {
    return Student.findOne({rollno: value}).then(student => {
      if (!student) {
        return Promise.reject('Student with given roll number doesn\'t exists!');
      }
    });
  })
] ,(req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }  

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

router.delete("/:rollno",[
  check('rollno').exists().isInt(),
  check('rollno').custom(value => {
    return Student.findOne({rollno: value}).then(student => {
      if (!student) {
        return Promise.reject('Student with given roll number doesn\'t exists!');
      }
    });
  })
 ] ,(req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }  

    const rollno = req.params.rollno;
      
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