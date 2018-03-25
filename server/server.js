
const path = require("path");// to specify folders  path
const express = require('express')
const app = express();
const publicPath = path.join(__dirname,'../public')
const port = process.env.PORT || 3000;

console.log(__dirname)
console.log(publicPath)

app.use(express.static(publicPath))

app.listen(port,(req,res) =>{
    console.log('Server is up and running on ',port)
})
