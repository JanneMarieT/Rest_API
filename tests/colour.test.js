const express = require("express");
const request = require("supertest");
const app = express();
require('dotenv').config()

const bodyParser = require("body-parser");

const colourRoutes = require("../routes/colour");
const authRoutes = require("../routes/auth");

app.use(bodyParser.json());
app.use("/colour", colourRoutes);
app.use("/", authRoutes);


describe("testing-guest-routes", () => {
    //test user is already created and has credentials email: "johndoe@yahoo.com", password:"0000"
    let token;
    test("POST /login - success", async () => {
      const credentials = {
        email: "johndoe@yahoo.com",
        password: "0000"
      }
      const { body } = await 
      request(app).post("/login").send(credentials);
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("token");
      token = body.data.token
    });

    test("GET /colour - success", async () => {
        const { body } = await request(app)
        .get("/colour")
        .set("Authorization", "Bearer " + token)

        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("ColourList:");
    })

    test("POST /colour - success", async () => {
      let ColourObj = {
        "name": "yellow"
    }
      const { body } = await request(app)
        .post("/colour")
        .send(ColourObj)
        .set("Authorization", "Bearer " + token)
        
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("result");
      expect(body.data.result).toBe("You made a new Colour");
      });
  
    //this test needs to have an colourid nr. 1!
    test("PUT /colour/1 - success", async () => {
        let ColourObj = {
          "name": "purple"
        }
        const { body } = await request(app)
          .put("/colour/1")
          .send(ColourObj)
          .set("Authorization", "Bearer " + token)
          
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Colour updated successfully.");
        });

    //there needs to be an colour id nr. 1!
    test("DELETE /colour - success", async () => {
            let ColourObj = {
                "id": 1
            }
            const { body } = await request(app)
              .delete("/colour")
              .send(ColourObj)
              .set("Authorization", "Bearer " + token)
            
            expect(body).toHaveProperty("data");
            expect(body.data).toHaveProperty("result");
            expect(body.data.result).toBe("You deleted a colour.");
            });
    
});