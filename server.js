const axios = require('axios');
const cheerio = require('cheerio');
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('/index.html');
})

app.get('/getInfo', (req, res) => {
    let URL = req['query']['URL']; //get the user inputted URL from the request
    axios.get(URL)
        .then(response => {
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

            res.send('<h1>Product: '+product+'<br> ASIN: '+ASIN+'<br> UPC: '+UPC+'</h1>') //display the information
        })
        .catch(error => {
            console.log(error);
        })
})

var server = app.listen(5000, () => {
    console.log('Server running on port 5000');
})