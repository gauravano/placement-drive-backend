const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
var logger = require("../logger");

const Student = require('../models/student');
const Registration = require('../models/registration');
const Company = require('../models/company');

/**
 * @api {get} /api/student/:rollno Request Student information
 * @apiSampleRequest https://gauravano-placement-drive-backend.glitch.me/api/student/:rollno
 * @apiName GetStudent
 * @apiGroup Student
 *
 * @apiParam {Number} rollno Student's unique roll number.
 *
 * @apiSuccess {Object} student Information of the student.
 */

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
          logger.info("Student not found in database");
          return res.status(404).json({
            message: "Student not found!"
          });
        }
        logger.info("Student found and details returned!");
        res.status(200).json({
          student: student
        });
      })
      .catch(err => {
        logger.error("Error caught!", err);
        res.status(500).json({
          error: err
        });
      });
  });

/**
 * @api {post} /api/student/ Add a Student
 * @apiName PostStudent
 * @apiGroup Student
 * 
 * @apiSampleRequest https://gauravano-placement-drive-backend.glitch.me/api/student/
 *
 * @apiParam {Number} rollno Roll number of the student.
 * @apiParam {String} name Name of the student.
 * @apiParam {Department} department Department of the student.
 * @apiParam {Number} cgpa CGPA of the student.
 *
 * @apiSuccess {Object} createdStudent Information of the created Student.  */


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
    logger.error("Bad request", errors.array());
    return res.status(400).json({ errors: errors.array() });
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
        logger.info("Student successfully created!", result);
        res.status(201).json({
          message: "Student successfully created!",
          createdStudent: result
        });
      })
      .catch(err => {
        logger.error("Error caught!", error);
        res.status(500).json({
          error: err
        });
      });
  });

  /**
 * @api {post} /api/student/register Register a Student for placement drive
 * @apiName RegisterStudent
 * @apiGroup Student
 * 
 * @apiSampleRequest https://gauravano-placement-drive-backend.glitch.me/api/student/register
 *
 * @apiParam {Number} rollno Roll number of the student.
 * @apiParam {String} companyName Name of the company.
 *
 * @apiSuccess {Object} createdEntry Information of the created entry.  */

  router.post("/register", [
    check('rollno').exists().isInt(), 
    check('companyName').exists().isString().trim()
  ] ,(req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Bad request", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }  
  
    const companyName = req.body.companyName;
    const rollno = req.body.rollno;

   Student.findOne({rollno: req.body.rollno}, (err, student) => {
        if (err) {
            logger.error("Bad request", err);
            res.status(400).json({
              error: err
            });
          }else if(student != null){
            Company.findOne({name: {'$regex': companyName,$options:'i'}}, (err, company) => {
                
                if(err){
                    logger.error("Bad request", err);
                    res.status(400).json({
                        error: err
                    });
                }else if(company != null){
                    Registration.findOne({companyName: {'$regex': companyName,$options:'i'}, rollno: rollno}, (err, entry) => {
                        if(err){
                            logger.error("Bad request", err);
                            res.status(400).json({
                                error: err
                            });    
                        }else if(entry != null){
                          logger.info("Entry with student name and company already exist!", entry);  
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
                                  logger.info("Student registration with company succesful!", result);
                                  res.status(201).json({
                                    message: "Registration Successful!",
                                    createdEntry: result
                                  });
                                })
                                .catch(err => {
                                  logger.error("Error caught ", err);
                                  res.status(500).json({
                                    error: err
                                  });
                                });
                        } 
                    })    
                }else{
                    logger.warn("Bad request, company with given name doesn't exist");
                    res.status(404).json({
                        error: "Company with given name doesn't exist!"
                    })
                }                
            })
          }else{
            logger.warn("Student with given roll number doesn't exist");
            res.status(404).json({
                error: "Student with given roll number doesn't exist!"
            })
          }
          
   });
  });

    /**
 * @api {delete} /api/student/unregister Unregister a Student for placement drive
 * @apiName UnregisterStudent
 * @apiGroup Student
 * 
 * @apiSampleRequest https://gauravano-placement-drive-backend.glitch.me/api/student/unregister
 *
 * @apiParam {Number} rollno Roll number of the student.
 * @apiParam {String} companyName Name of the company.
 *
 * @apiSuccess {Object} deletedEntry Information of the deleted entry.  */

  router.delete("/unregister", [
    check('rollno').exists().isInt(), 
    check('companyName').exists().isString().trim()
  ] ,(req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Bad request", errors);
      return res.status(400).json({ errors: errors.array() });
    }  

    const companyName = req.body.companyName;
    const rollno = req.body.rollno;

   Student.findOne({rollno: req.body.rollno}, (err, student) => {
        if (err) {
            logger.error("Bad request", err);
            res.status(400).json({
              error: err
            });
          }else if(student != null){
            Company.findOne({name: {'$regex': companyName,$options:'i'}}, (err, company) => {
                if(err){
                    logger.error("Bad request", err);
                    res.status(400).json({
                        error: err
                    });
                }else if(company != null){
                    Registration.findOneAndDelete({companyName: {'$regex': companyName,$options:'i'}, rollno: rollno}, (err, entry) => {
                        if(err){
                            logger.error("Bad request", err);
                            res.status(400).json({
                                error: err
                            });    
                        }else if(entry != null){
                            logger.verbose("Successfully unregistered", entry);
                            res.status(200).json({
                                message: `Successfully unregistered for the drive with the ${companyName}`,
                                deletedEntry: entry
                            })
                        }else{
                            logger.error("No registration record found");  
                            res.status(400).json({
                                error: "No registration found for given records!"
                            })
                        } 
                    })    
                }else{
                    logger.warn("Company with given name doesn't exist");               
                    res.status(404).json({
                        error: "Company with given name doesn't exist!"
                    })
                }                
            })
          }else{
            logger.warn("Student with given name doesn't exist");
            res.status(404).json({
                error: "Student with given roll number doesn't exist!"
            })
          }
          
   });
  });

 /**
 * @api {put} /api/student/:rollno Edit a student record
 * @apiName UpdateStudent
 * @apiGroup Student
 * 
 * @apiSampleRequest https://gauravano-placement-drive-backend.glitch.me/api/student/:rollno
 *
 * @apiParam {Number} rollno Roll number of the student. Roll number can't be updated
 * @apiParam {String} name Updated name of the student.
 * @apiParam {String} department Updated department of the student.
 * @apiParam {Number} cgpa Updated CGPA of the 
 *
 * @apiSuccess {Object} updatedRecord Information of the updated student record.  */

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
      logger.error("Bad request", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }  

    const rollno = req.params.rollno;
    
    Student.findOneAndUpdate({ rollno },
        req.body,
        { new: true },
        (err, student) => {
        if (err) {
          logger.error("Bad request", err);
          res.status(400).json({
            error: err
          });
        }else{
          logger.verbose("Student record successfully updated", student);
          res.status(200).json({
            message: "Student record successfully updated!",
            upodatedRecord: student
          });
        }
      });
});

  /**
 * @api {delete} /api/student/:rollno Delete a Student from records
 * @apiName DeleteStudent
 * @apiGroup Student
 * 
 * @apiSampleRequest https://gauravano-placement-drive-backend.glitch.me/api/student/:rollno
 *
 * @apiParam {Number} rollno Roll number of the student.
 *
 * @apiSuccess {Object} deletedEntry Information of the deleted student record.  */
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
      logger.error("Bad request", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }  
    const rollno = req.params.rollno;
      
    Student.findOneAndDelete({ rollno: req.params.rollno })
      .exec()
      .then(result => {
        logger.verbose("Student deleted successfully", result);
        res.status(200).json({
          message: "Student deleted successfully!",
          deletedEntry: result
        });
      })
      .catch(err => {
        logger.error("Error caught", err);
        res.status(500).json({
          error: err
        });
      });
  });

module.exports = router;