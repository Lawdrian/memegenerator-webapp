var express = require('express');
var router = express.Router();


const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { verifyToken, secretKey } = require('../middlewares.js');

const mongoose = require('mongoose');
const User = mongoose.model("User"); 
const Template = mongoose.model("Template");
const GoogleUser = mongoose.model("GoogleUser"); 



/**
 * @swagger
 * /user/registration:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal Server Error
 */
router.post('/registration', async (req, res) => {
  try {
    const { email, password } = req.body; //exrtact registraion-data out of request-body 

    const existingUser = await User.findOne({ email }); 
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await argon2.hash(password); //hasing pw with argon2

    const newUser = await User.create({ email, password:hashedPassword });

    res.json({ success: true, user: newUser }); 
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log in a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Email not found or password incorrect
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', async (req, res) => {
  console.log("LOGIN");
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }); 

    if (!user) {    // Check if the user exists
      return res.status(401).json({ error: 'Email not found' });
    }
    // Verify entered password with the hashed-passwodr of the db
    const verified = await argon2.verify(user.password, password); 

    if (!verified) {
      return res.status(401).json({ error: 'passwort incorrect' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });

    res.json({ success: 'Authentication successful', token, user });
} catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /user/api-login:
 *   post:
 *     summary: Log in a user via API
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               googleId:
 *                 type: string
 *                 example: 1234567890
 *     responses:
 *       200:
 *         description: User successfully created in the database and logged in or Success API-authentification - logged in
 *       500:
 *         description: Internal Server Error
 */
router.post('/api-login', async (req, res) => {
    const { googleId } = req.body;
  
    try {
      console.log('Received API-Login ID:', googleId);
  
      const user = await User.findOne({ googleId });
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

      if (!user) {
        const newUser = await GoogleUser.create({ googleId }); 
  
        res.json({
            success: 'User successfully created in the database && logged in',
            user: { _id: newUser._id, googleId: newUser.googleId},
            token: token
          });      
        } else {
        res.json({ success: 'Success API-authentification - logged in', token:token });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;