const app = require('express');
const morgan = require('morgan');

app.use(morgan(dev)); // For logging the requests in the terminal

app.use('/api/student', require('./student'));
app.use('/api/company', require('./company'));

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: error.message
    });
});

exports = module.exports = {
    app
};