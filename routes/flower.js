var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var FlowerService = require("../services/FlowerService")
var flowerService = new FlowerService(db);
var ColourService = require("../services/ColourService")
var colourService = new ColourService(db);
var UserService = require("../services/UserService")
var userService = new UserService(db);
var jwt = require('jsonwebtoken')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.use(jsend.middleware);

//GET flower list for a user 
router.get('/', function(req, res, next) {
  // check token
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
      return res.status(401).json({ success: false, message: 'Error! Token was not provided.' });
    }
    const token = tokenHeader.split(' ')[1];
    try {
      // Verify token and get user ID
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      flowerService.getOne(decodedToken.id).then((flower) => {
      res.jsend.success({"result": "FlowerList:", UserId: decodedToken.id, data: {Flower: flower || []}});
    });
  
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token.' });
  } 

})

// POST a new flower
router.post('/', jsonParser, async function(req, res, next) {
  const { Name, ColourId } = req.body;
  if (Name == null) {
    return res.jsend.fail({"name": "Name is required."});
  }
  if (ColourId == null) {
    return res.jsend.fail({"ColourId": "ColourId is required."});
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
      
      //Check if user exist 
      /*(if the user has been deleted the token still works...
      but the token is unable to create/document a flower in db since it cant find the user in the database and connect user to the flower)*/
      var UserExist = await userService.getUser(decodedToken.id);
      if(!UserExist) {
        return res.jsend.fail({"User": "this user does not exist"});
      }
      if(UserExist) {

        // Check if ColourId exist
        var colour = await colourService.getColour(ColourId);
        if(!colour) {
          return res.jsend.fail({"ColourId": "this colour does not exist"});
        }
        if(colour) {
        // Create new flower
        flowerService.create(Name, ColourId, decodedToken.id);
        res.jsend.success({"result": "New Flower documented in database", data: {Name: Name, ColourId: ColourId, UserId: decodedToken.id}});
        }
      }

    }catch (err) {
      res.status(401).json({ success: false, message: 'Invalid token.' });
    } 

});

//Change flower item
//need to be able to change it to nothing that exist for this user
router.put('/:id', jsonParser, async function(req, res, next) {
  const { name, ColourId } = req.body;
  if (name == null) {
    return res.jsend.fail({"name": "Name is required."});
  }
  if (ColourId == null) {
    return res.jsend.fail({"ColourId": "ColourId is required."});
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

    //Check if the flower exist in db
    var flower = await flowerService.getFlower(req.params.id);
    if(!flower) {
       return res.jsend.fail({"id": "this flower does not exist in database"});
    }
    if(flower) {
    // Find flower by ID and update it
    await flowerService.update(req.params.id, name, ColourId); 
    return res.status(200).json({ success: true, message: 'Flower updated successfully.' });
    }

  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token.' }); 
  }

});

//Delete flower 
router.delete('/', jsonParser, async function(req, res, next) {
  // check token
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({ success: false, message: 'Error! Token was not provided.' });
  }
  const token = tokenHeader.split(' ')[1];
  try {
    // Verify token and get user ID
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    //Check id
    if(req.body.id !== undefined){ //undefined instead of null 
      let id = req.body.id
      if(id == null) {
        return res.jsend.fail({"data":"id is required."});
      }
      var flower = await flowerService.getFlower(id);
      if(flower == null) {
        return res.jsend.fail({"id": "No such flower-id in the database"});
      }
      // Check if to-do item belongs to user
      if (flower.UserId === decodedToken.id) {
        await flowerService.delete(id);
        return res.jsend.success({"result": "You deleted a flower"});
      } else {
        return res.jsend.fail({"id": "No such flower-id for this user"});
      }

    //Check name
    } else if(req.body.name !== undefined){ 
      let name = req.body.name
      if(name == null) {
        return res.jsend.fail({"data":"name is required."});
      }
      var flower = await flowerService.getFlowerName(name);
      if(flower == null) {
        return res.jsend.fail({"name": "No such flower in the database"});
      }
      // Check if flower belongs to user -->what if its multiple flowers of same name to diferent users...
      if (flower.UserId === decodedToken.id) {
        await flowerService.delete(flower.id);
        return res.jsend.success({"result": "You deleted a flower"});
      } else {
        return res.jsend.fail({"id": "No such flower for this user"});
      }

    }else{
        return res.jsend.fail({"data":"id or name is required."});
    }

  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token.' }); 
  }

});

module.exports = router;