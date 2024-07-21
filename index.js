const express = require("express");

const userModel = require("./models/Connection");

const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");

const bcrypt = require("bcrypt");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("Home");
});

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    
    bcrypt.hash(password, salt, (err, hash) => {
      
      userModel
        .create({ username, email, password:hash })
        .then((response) => {
          res.redirect("/");
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  console.log(username, email, password);
});

app.get("/login", (req, res) => {
  res.render("Login");
});

app.get("/dashboard", (req, res) => {
  if(req.cookies.user){
    res.render("UserDashboard",{username:req.cookies.user});
  }
  else{
    res.redirect("/login");
  }
});

app.post("/log",async(req,res)=>{
   let user = await userModel.findOne({username:req.body.username});

   if(!user) return res.send("User not found");

   bcrypt.compare(req.body.password,user.password,(err,result)=>{
    

    if(result){
      const token=jwt.sign({username:user.username},"ChocoMoco");
      res.cookie("user",token);

      res.redirect("/dashboard");
      
    }
    else{
      res.send("Error");
    }
   })
});

app.get("/logout",(req,res)=>{
    res.clearCookie("user");
    res.redirect("/login");
});


app.listen("8000");
