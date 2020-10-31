require("dotenv").config();
const axios = require("axios");
const giphy = process.env.GIPHY_URL_START;

const test = (search)=> {axios((giphy + search) ,{
    method: 'get',
    responseType: 'json'
})
    .then((res)=>{
        console.log(res.data.data[0].images.original.url)
    }).catch((e)=>{
        console.log(e)
    })
}

test("golf")