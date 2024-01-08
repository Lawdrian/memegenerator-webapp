const mongoose = require("mongoose");
const Schema = mongoose.Schema;




const GoogleUserSchema = new mongoose.Schema({
    googleId: {
      type: String,
      sparse: true
    },
    meme_create: {
      type: Schema.Types.ObjectId,
      ref: 'Meme',
      required: false,
    }
  },
  {
    collection: "User"  
  });



mongoose.model("GoogleUser", GoogleUserSchema);  

const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    meme_create: {
      type: Schema.Types.ObjectId,
      ref: 'Meme',
      required: false,
    }
  },
  {
    collection: "User" 
  });
  
mongoose.model("User", UserSchema);