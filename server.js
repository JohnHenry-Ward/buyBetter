const axios = require('axios');
const cheerio = require('cheerio');
var express = require('express');
var app = express();

app.use(express.static('public')); //set the static folder

// Main page route
app.get('/', (req, res) => {
    res.sendFile('/index.html');
})

// route to get information from an Amazon product page
app.get('/getInfo', (req, res) => {
    let URL = req['query']['URL']; //get the user inputted URL from the request

    const backBtn = '<button onclick="history.back()">Go Back</button>';

    axios.get(URL) //get request to get the HTML of the URL
        .then(response => { //once the request is processed
            const $ = cheerio.load(response.data); //use cheerio to access the DOM of the html

            let product = $('#productTitle'); //get the name of the product

            let ASIN = $('#ASIN')['0']['attribs']['value']; //get the ASIN of the product

            let UPC = ''; //get the UPC of the product (if it is listed)
            let UPClocation = $('#detailBullets_feature_div').find('span').find('span').text();

            for(let i = 0; i < UPClocation.length; i++) {
                if(UPClocation.substring(i, i+3) == 'UPC'){
                    UPC = UPClocation.substring(i+9, i+22);
                }
            }

            if(UPC == ''){
                UPC = 'UPC is not listed';
            }

            let departments = ''; //get the depeartments the product is categorized as
            let deptLocation = $('#wayfinding-breadcrumbs_feature_div');
            departments = deptLocation.text();
            deptArr = departments.split('›');

            res.send('<h1>Product: '+product+
                     '<br><br> ASIN: '+ASIN+
                     '<br><br> UPC: '+UPC+
                     '<br><br> Departments: '+deptArr+
                     '</h1>'+
                     backBtn); //display the information

        })
        .catch(error => {
            console.log(error);
        })
})

var server = app.listen(5000, () => {
    console.log('Server running on port 5000');
})