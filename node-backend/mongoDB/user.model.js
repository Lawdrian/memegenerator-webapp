/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the user
 *           example: user@example.com
 *         password:
 *           type: string
 *           description: The hashed password of the user
 *           example: $2a$10$Q3CgIxZzgE2NcDl1J8lZuOZx4tO9F7x2QZCgF4bZ3iS6P.Q3CgF4bZ
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GoogleUserSchema = new mongoose.Schema({
    googleId: {
      type: String,
      sparse: true
    },
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
  },
  {
    collection: "User" 
  });
  
mongoose.model("User", UserSchema);