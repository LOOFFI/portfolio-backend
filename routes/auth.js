const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const passport = require('../config/passport');
const bcrypt = require("bcrypt");


router.post('/signup', (req, res, next) => {

  console.log(req.body)
  const {email,originalPassword} = req.body;
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({email,encryptedPassword})
    .then(userDoc=> {
      req.logIn(userDoc, () => {
        userDoc.encryptedPassword = undefined;
        res.json({ userDoc });
      });
    })
    .catch(err => next(err));
});

router.post("/login", (req, res, next) => {
  const { email, originalPassword } = req.body;
  console.log(req.body)
  
  User.findOne({ email: { $eq: email } })
    .then(userDoc => {
      
      if (!userDoc) {
       
        next(new Error("Incorrect email. 🤦‍♂️"));
        return;
      }

      
      const { encryptedPassword } = userDoc;
      
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        
        next(new Error("Password is wrong. ️🤯"));
        return;
      }   
      req.logIn(userDoc, () => {
        userDoc.encryptedPassword = undefined;
        res.json({ userDoc });
      });
    })
    .catch(err => next(err));
});


router.get('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ msg: 'Logged out' });
});

router.get('/profile', isAuth, (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).json({ user }))
    .catch((err) => res.status(500).json({ err }));
});

function isAuth(req, res, next) {
  req.isAuthenticated() ? next() : res.status(401).json({ msg: 'Log in first' });
}

module.exports = router;
