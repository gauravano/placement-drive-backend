const express = require('express');
const router = express.Router();

const Company = require('../models/company');
const Registration = require('../models/registration');

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

router.delete("/:name", (req, res, next) => {
    const companyName = req.params.name;
    Company.findOneAndDelete({ name: {'$regex': companyName,$options:'i'}}, (err, deletedCompany) => {
        if(err){
                res.status(400).json({
                error: err
            });
        }else if(deletedCompany == null){
            res.status(404).json({
                error: `Company by name ${companyName} not found!`
            })
        }else{
            Registration.find({companyName: {'$regex': companyName,$options:'i'}}).exec().then(entries => {
                entries.map(entry => {
                    Registration.deleteMany({companyName: {'$regex': companyName,$options:'i'}}, (err, result) => {
                        if(err){
                            res.status(400).json({
                                error: err
                            })
                        }else{            
                            res.status(200).json({        
                                message: "Company successfully unregistered and related registrations also deleted!",
                                deletedCompany: deletedCompany
                            })
                        }
                    })
                })
            })
        }
    });
  });
 
module.exports = router;