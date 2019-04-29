## Placement drive server app
A simple server application, that can be used for registering students and companies for a placement event in an institute.

**API documentation:** https://gauravano.github.io/placement-drive-backend/apidoc/index.html

**API server hosted at Glitch:** https://gauravano-placement-drive-backend.glitch.me/api/

## Installation

1. In the console, download a copy of the repo by running `git clone https://github.com/gauravano/placement-drive-backend`.
2. Enter the placement-drive-backend directory with `cd placement-drive-backend`.
3. Run `npm install` to install the node dependencies mentioned in the package.json.
4. Run `npm start` for running the development server. Navigate to `http://localhost:4000/`.
5. The database is hosted at Mongo Lab, so you need to create a free sandbox at https://mlab.com/ and then copy the URI from there and save it as `MONGO_URO: <URI from your sandbox without quotes>` in .env file.

## Development server

Run `npm start` for a running development server. Navigate to `http://localhost:4000/`.

## Documentation

The API documentation is generated using https://api-docs.io/ by using npm package. 

The documentation give details about all the endpoints, parameters, and also provide option to make sample requests from there only. So, head over to  https://gauravano.github.io/placement-drive-backend/apidoc/index.html and do the testing :smile:

## Some enhanced features

### Logging :memo: 

Logging in the application is done using 2 modules [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan). The logic for setting the logger is at https://github.com/gauravano/placement-drive-backend/blob/master/logger.js. And, both loggers are combined at https://github.com/gauravano/placement-drive-backend/blob/master/app.js#L7-L10 

### API Data validation and Error handling 

Schema validation is used while creating the schema using Mongoose only, see https://mongoosejs.com/docs/validation.html for details.

Another npm package [Express-validator](https://express-validator.github.io/) is used for performing validation of API, sanitization, error handling, etc.
