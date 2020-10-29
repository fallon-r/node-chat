
require("dotenv").config();
const port = process.env.PORT;

const path = require("path");
const express = require("express");

const app = express();

//  paths
const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));

app.get('', (req,res)=>{
    res.render('index')
})

app.listen(port, () => {
  console.log(`server's up on port ${port}`);
});
