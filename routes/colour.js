var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var ColourService = require("../services/ColourService")
var colourService = new ColourService(db);
var FlowerService = require("../services/FlowerService") //need this to check that i dont delete a colour that is attatched to a flower!
var flowerService = new FlowerService(db);
var jwt = require('jsonwebtoken')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.use(jsend.middleware);

//GET colour list
router.get('/', function(req, res, next) {
   // check token
   const tokenHeader = req.headers.authorization;
   if (!tokenHeader) {
     return res.status(401).json({ success: false, message: 'Error! Token was not provided.' });
   }
   const token = tokenHeader.split(' ')[1];
   try {
        //Verify token and get user Id
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET );
        console.log(decodedToken.id)
        colourService.getOne().then((colour) => {
            console.log(colour)
            res.jsend.success({"result": "ColourList:", data: {Colour: colour || []}});
        });

    } catch (err) {
      res.status(401).json({ success: false, message: 'Invalid token.' });
    } 

})

// POST a new colour - if it exixt you cant make it again!
router.post('/', jsonParser, function(req, res, next) {
    const Name = req.body.name;
    if (Name == null) {
      return res.jsend.fail({"name": "Name is required."});
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
      // Create new colour
      colourService.create(Name);
      res.jsend.success({"result": "You made a new Colour", User: decodedToken.id, data: {Name: Name}}); //should it also return the new id?
      
    } catch (err) {
      res.status(401).json({ success: false, message: 'Invalid token.' });
    } 

});

//Change Category item
router.put('/:id', jsonParser, async function(req, res, next) { 
  if (req.body.name == null) {
    return res.jsend.fail({"name": "Name is required."});
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

      //Check if the category exist
      var colour = await colourService.getColour(req.params.id);
      if(!colour) {
         return res.jsend.fail({"ColourId": "this colour does not exist"});
      }
      if(colour) {
      // Find todo by ID and update it
      await colourService.update(req.params.id, req.body.name); 
      return res.status(200).json({ success: true, message: 'Colour updated successfully.' });
      }

    } catch (err) {
      res.status(401).json({ success: false, message: 'Invalid token.' });
    } 

});

//Delete a colour - not delete if it has a flower attached!
//can be deleted by id or name...
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
      console.log(decodedToken)

      // Check id
    if(req.body.id !== undefined){ //undefined instead of null - 
      let id = req.body.id
      if(id == null) {
          return res.jsend.fail({"data":"id is required."});
      }
      var colour = await colourService.getColour(id);
      if(colour == null) {
        return res.jsend.fail({"id": "No such colour-id in the database"});
      }
      //check if it belongs to a flower...
      var flower = await flowerService.CheckFlowerId(colour.id);
      if(flower) {
        return res.jsend.fail({"id": "You cant delete an colour that is conected to a flower!"});
      }
      if(!flower) {
      //delete colour
      await colourService.delete(id);
      return res.jsend.success({ "result": "You deleted a colour."})
      }

      // Check name
    } else if(req.body.name !== undefined){ 
      let name = req.body.name
      if(name == null) {
        return res.jsend.fail({"data":"name is required."});
      }
      var colour = await colourService.getColourName(name);
      if(colour == null) {
        return res.jsend.fail({"name": "No such colour-name in the database"});
      }
      // Check if it belongs to a flower...
      var flower = await flowerService.CheckFlowerId(colour.id);
      if(flower) {
        return res.jsend.fail({"id": "You cant delete an colour that is connected to a flower!"});
      }
      if(!flower) {
      //delete colour
      await colourService.delete(colour.id);
      return res.jsend.success({ "result": "You deleted a colour."})
      }

    } else {
      return res.jsend.fail({"data":"id or name is required."});
      }
      
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token.' }); 
  }

});

module.exports = router;