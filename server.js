const express = require('express')
const app = express()
const port = 9000
const apiV1 = require('./App/v1');
require('./App/configs/constants');
require('./App/configs/connection');


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use('/api/v1', apiV1);

app.get('/home', (req, res) => { 
    let obj = {
        status : 200 ,
        data : {
            image : "This is testing"
        }
    }
    res.send(obj)
})

app.listen(port, () => console.log(`Pintaki app listening on port ${port}!`))