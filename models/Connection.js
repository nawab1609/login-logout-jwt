const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Mydb")
  .then((response)=>{console.log("Connected to MongoDB")})
  .catch((error)=>{console.error("Error")});

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("user", UserSchema);
