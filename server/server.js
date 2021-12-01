const axios = require('axios'); //to make a request to the amazon url
const cheerio = require('cheerio'); //to parse the data returned
const path = require('path');
var express = require('express'); //to create a local server
var app = express(); //creation of the local server

const places = require('../public/js/places');

app.use(express.static('public')); //set the static folder

// Main page route
app.get('/', (req, res) => {
    res.sendFile('index.html');
});


// route to get information from an Amazon product page
app.get('/getInfo', (req, res) => {
    let URL = req['query']['URL']; //get the user inputted URL from the request
    let zipCode = req['query']['zip']; // get the zip code 
   
    const backBtn = '<button onclick="history.back()">Go Back</button>';

    axios.get(URL) //get request to get the HTML of the URL
        .then(response => { //once the request is processed
            const $ = cheerio.load(response.data); //use cheerio to access the DOM of the html

            let product = $('#productTitle'); //get the name of the product

            let ASIN = $('#ASIN')['0']['attribs']['value']; //get the ASIN of the product

            //get the UPC of the product (if it is listed)
            let UPC = ''; 
            let details = $('#detailBullets_feature_div');
            let UPClocation = details.find('span').find('span').text();

            for(let i = 0; i < UPClocation.length; i++) {
                if(UPClocation.substring(i, i+3) == 'UPC'){
                    UPC = UPClocation.substring(i+9, i+22);
                }
            }

            if(UPC == '') {
                UPC = 'UPC is not listed';
            }

            //get the depeartments the product is categorized as
            let departments = ''; 
            let deptLocation = $('#wayfinding-breadcrumbs_feature_div');
            departments = deptLocation.text();
            deptArr = departments.split('›');

            //get the name of the seller of this product
            let soldBy = $('#productOverview_feature_div').children().find('tr:contains("Brand")').text();
            soldBy = soldBy.replace('Brand', '').trim(); 
            if (soldBy == '') {
                soldBy = details.children().find('li:contains("Manufacturer")').last().text();
                soldBy = soldBy.replace('Manufacturer', '').replace(':', '').replace(/(\r\n|\n|\r)/gm, '').trim();
            }

            if (soldBy == '') {
                soldBy = '-1';
            }

            // places.initMap(JSON.stringify(deptArr));
            newDeptArr = [];
            deptArr.forEach(dept => {
                newDeptArr.push(dept.replace(/(\r\n|\n|\r)/gm, '').trim());
            });
            let query = newDeptArr.join().replace(/&/g, '');
            query = query.replace(/,/g, ' ');
            res.redirect(`result.html?query=${query}&zip=${zipCode}&storeName=${soldBy}`); //we send the query to the result.html to display the stores and map

            //Display all the info
            // res.send(`<h2>Product: ${product} </h2><br>
            //           <h2>Sold By: ${soldBy} </h2><br>
            //           <h2>ASIN: ${ASIN} </h2><br>
            //           <h2>UPC: ${UPC} </h2><br>
            //           <h2>Departments: ${deptArr} </h2><br>
            //           ${backBtn}`); 

        })
        .catch(error => {
            console.log(`Error: ${error}`);
            
            res.redirect(`index.html?url=${URL}&status=error`);
        })
})

app.get('/info', (req, res) => {
    res.sendFile('info.html', {root: 'public'});
})

var server = app.listen(5001, () => {
    console.log('Server running on port 5001');
})