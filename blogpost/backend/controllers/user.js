const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {

  bcrypt.hash(req.body.password, 10).then( hash => {
    const user = new User({email: req.body.email, password: hash});

    user.save().then(result => {
      res.status(201).json({
        message: 'User created',
        result: result
      })
    })
    .catch(error => { res.status(500).json({message: "Email already taken"});})
})
}


exports.loginUser = (req, res, next) => {

  let fetchedUser;

  User.findOne( { email: req.body.email}).then( user => {
    if (!user) {return res.status(401).json({
      message: "Invalid Credentials"
    })}

    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password)

  }).then( result => {

    if(!result ) { return res.status(401).json({message: "Invalid Credentials"}) }
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, process.env.JWT_SECRET, {expiresIn: "5h"});
    res.status(200).json({token, expiresIn: 18000, userId: fetchedUser._id})

  }).catch(
    error => { return res.status(401).json({message: "Invalid Credentials"})}
  )
}
