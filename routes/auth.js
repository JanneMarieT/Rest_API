var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var crypto = require('crypto');
var UserService = require("../services/UserService")
var userService = new UserService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
router.use(jsend.middleware);
var jwt = require('jsonwebtoken')


//signup 
router.post("/signup", async (req, res, next) => {
    const { name, email, password } = req.body;
    if (name == null) {
      return res.jsend.fail({"name": "Name is required."});
    }
    if (email == null) {
      return res.jsend.fail({"email": "Email is required."});
    }
    if (password == null) {
      return res.jsend.fail({"password": "Password is required."});
    }
    var user = await userService.getOne(email);
    if (user != null) {
      return res.jsend.fail({"email": "Provided email is already in use."});
    }
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return next(err); }
      userService.create(name, email, hashedPassword, salt)
      res.jsend.success({"result": "You created an account."});
    });
});

//login 
router.post("/login", jsonParser, async (req, res, next) => {
  const { email, password } = req.body;
  if(email != undefined && password != undefined){
  userService.getOne(email).then((data) => {
      if(data === null) {
          return res.jsend.fail({"result": "Incorrect email or password"});
      }
      crypto.pbkdf2(password, data.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return cb(err); }
        if (!crypto.timingSafeEqual(data.encryptedPassword, hashedPassword)) {
            return res.jsend.fail({"result": "Incorrect email or password"});
        }
        let token;
        try {
          token = jwt.sign(
            { id: data.id, email: data.email },
            process.env.TOKEN_SECRET,
            { expiresIn: "1h" }
          );
        } catch (err) {
          res.jsend.error("Something went wrong with creating JWT token")
        }
        res.jsend.success({"result": "You are logged in", "id": data.id, email: data.email, token: token});
      });
  });
} else {
  return res.jsend.fail({"result": "need both email and password"});
}
});


//delete 
router.delete('/', jsonParser, async function(req, res, next) {
    let email = req.body.email;
    if(email == null) {
        return res.jsend.fail({"email": "Email is required."});
    }
    var user = await userService.getOne(email);
    if(user == null) {
        return res.jsend.fail({"email": "No such user in the database"});
    }

    // check token
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
      return res.status(401).json({ success: false, message: 'Error! Token was not provided.' });
    }
    const token = tokenHeader.split(' ')[1];
    try {
      // Verify token and get user ID
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      console.log(decodedToken.id)
      await userService.delete(email);
      res.jsend.success({"result": "You deleted an account."});

    } catch (err) {
      res.status(401).json({ success: false, message: 'Invalid token.' });
    } 
});

module.exports = router;