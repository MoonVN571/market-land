const express = require("express");
const app = express();

cookieParser = require('cookie-parser');

app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use("/", require("./callback").route);

app.get("/", (req,res)=>{
    res.json({content:"Not supported!"});
});
const { NAPTHE } = require('./config.json');
app.listen(NAPTHE.PORT, () => console.log("success"));