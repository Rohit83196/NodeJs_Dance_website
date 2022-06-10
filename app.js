const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const multer = require('multer');
var mongoose = require('mongoose');
const bodyparser = require('body-parser');
// const req = require("express/lib/request");
app.use(bodyparser.urlencoded({extended:true}))
// app.use(bodyparser.json())
mongoose.connect('mongodb://localhost/dance_N_dance', {useNewUrlParser:true, useUnifiedTopology: true});
const port = 80;

// define mongoose schema for user details
var contactSchema  = new mongoose.Schema({
    name:String ,
    email:String,
    number:String,
    message:String,
})
var hello = mongoose.model('information',contactSchema);
console.log("rohit say hello",hello);

 
app.use("/static",express.static('static'));
app.use(express.urlencoded());

app.set('view engine','pug');
app.set('views',path.join(__dirname,"views"));


var storage = multer.diskStorage({
    destination:function (req,file,callback) {
        var dir = "./uploads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        callback(null,"./uploads")
        // callback(null,"C:/Users/ROHIT VERMA/Pictures/photoshop")
    },
    filename:function (req,file,callback) {
        callback(null , file.originalname)
    }
});

var upload = multer({storage:storage}).array("files",12);
// app.post('/upload',(req,res)=>{
app.post('/kall',(req,res,next)=>{
    upload(req,res,function (err) {
        if (err) {
            console.log(err);
            return res.send("something gone wrong")
        }
        res.send('upload successfully')   
    })
}) ;


app.get("/", (req,res)=>{
    res.status(200).render("home.pug")
})
app.get("/about", (req,res)=>{
    res.status(200).render("about.pug")
})

app.get("/services", (req,res)=>{
    res.status(200).render("services.pug")
})

app.get("/contact", (req,res)=>{
    res.status(200).render("contact.pug")
})
app.post("/contact", (req,res)=>{
    var myData = new hello(req.body);
    console.log(hello);
    console.log(myData);
    console.log('req body',req.body);
    myData.save().then(()=>{
        // res.send("this item has been send to the database")  
    res.status(200).redirect("/contact")

    }).catch(()=>{
        res.status(404).send("item was not saved to the database")
    });
    // res.status(200).redirect("/contact")
    // res.status(200).render(window.alert("data saved to the data base"));
    
})

// app.get("/img" , (req,res)=>{
//     res.status(200).render("img.pug")
  
// })
// app.post('/upload',(req,res,next)=>{
//     upload(req,res,function (err) {
//         if (err) {
//             console.log(err);
//             return res.send("something gone wrong")
//         }
//         res.send('upload successfully')   
//     })
// }) ;

app.listen(port,()=>{
    console.log(`the application started successfully on ${port}`)
})