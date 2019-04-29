const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
var logger = require('../logger');

const Company = require('../models/company');
const Registration = require('../models/registration');

 /**
 * @api {get} /api/company/:companyName Get information about a company
 * @apiName ShowCompany
 * @apiGroup Company
 *
 * @apiSampleRequest https://gauravano-placement-drive-backend.glitch.me/api/company/:companyName
 * 
 * @apiParam {String} companyName Name of the company.
 *
 * @apiSuccess {Object} company Information of the company.  */

router.get("/:companyName", [
    check('companyName').exists().isString()
] ,(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Bad request", errors);  
      return res.status(400).json({ errors: errors.array() });
    }

    Company.findOne({name: {'$regex': req.params.companyName,$options:'i'}})
      .exec()
      .then(company => {
        if (!company) {
          logger.warn("Company doesn't exist");
          return res.status(404).json({
            message: "Company not found"
          });
        }
        logger.verbose("Company information fetched: ", company);
        res.status(200).json({
          message: "Company information fetched!",  
          company: company
        });
      })
      .catch(err => {
        logger.error("Error caught", err);
        res.status(500).json({
          error: err
        });
      });
  });


 /**
 * @api {post} /api/company/ Register a company for placement drive
 * @apiName RegisterCompany
 * @apiGroup Company
 *
 * @apiSampleRequest https://gauravano-placement-drive-backend.glitch.me/api/company
 * 
 * @apiParam {String} name Unique name of the company.
 * @apiParam {String} description Description of the company.
 * @apiParam {Number} numVacancies Number of vacancies. Default is 1.
 *
 * @apiSuccess {Object} createdCompany Information of the added company.  */
router.post("/", [
    check('name').exists().isString().trim(),
    check('name').custom(value => {
      return Company.findOne({name: {'$regex': value,$options:'i'}}).then(company => {
        if (company) {
          logger.info("Company with same name already exists");
          return Promise.reject('Company with same name already exists!');
        }
      });
    }),
    check('numVacancies').optional().isInt(),
    check('description').optional().isString().trim()
  ],(req, res, next) => {
    
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error("Bad request", errors);
        return res.status(400).json({ errors: errors.array() });
    }

    const company = new Company({
      name: req.body.name,
      description: req.body.description,
      numVacancies: req.body.numVacancies
    });
    company
      .save()
      .then(result => {
        logger.verbose("Company registered successfully", result);
        res.status(201).json({
          message: "Company registered for the placement drive!",
          createdCompany: result
        });
      })
      .catch(err => {
        logger.error("Error caught", err);
        res.status(500).json({
          error: err
        });
      });
});

/**
 * @api {delete} /api/company/:name Unregister a company from placement drive
 * @apiName UnregisterCompany
 * @apiGroup Company
 *
 * @apiSampleRequest https://gauravano-placement-drive-backend.glitch.me/api/company/:name
 * @apiParam {String} name Unique name of the company.
 *
 * @apiSuccess {Object} deletedCompany Information of the deleted company.  */
router.delete("/:name", [
    check('name').exists().isString().trim()
] ,(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error("Bad request", errors);
      return res.status(400).json({ errors: errors.array() });
    }
    const companyName = req.params.name;
    console.log("nameme",companyName);
    Company.findOneAndDelete({ name: {'$regex': companyName,$options:'i'}}, (err, deletedCompany) => {
        if(err){
                logger.error("Bad request", err);
                res.status(400).json({
                error: err
            });
        }else if(deletedCompany == null){
            logger.warn("Company not found", deletedCompany);
            res.status(404).json({
                error: `Company by name ${companyName} not found!`
            })
        }else{
            console.log("registrants dele");
            Registration.find({companyName: {'$regex': companyName,$options:'i'}}).exec().then(entries => {
                entries.map(entry => {
                    Registration.deleteMany({companyName: {'$regex': companyName,$options:'i'}}, (err, result) => {
                        if(err){
                            logger.error("Bad request", err);
                            res.status(400).json({
                                error: err
                            })
                        }               
                    })
                })
                    logger.verbose("Company successfully deleted", deletedCompany);
                    res.status(200).json({        
                        message: "Company successfully unregistered and related registrations also deleted!",
                        deletedCompany: deletedCompany
                    })
            })
        }
    });
  });
 
module.exports = router;