const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('port', (process.env.PORT || 4000));

app.listen(app.get('port'), function () {
   console.log("Node app is running at Port: ", app.get('port'));
});