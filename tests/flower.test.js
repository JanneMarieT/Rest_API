const express = require("express");
const request = require("supertest");
const app = express();
require('dotenv').config()

const bodyParser = require("body-parser");

const flowerRoutes = require("../routes/flower");
const authRoutes = require("../routes/auth");

app.use(bodyParser.json());
app.use("/flower", flowerRoutes);
app.use("/", authRoutes);


describe("testing-guest-routes", () => {

    //LOGIN WITH A VALID ACCOUNT AND SAVING THE JWT TOKEN
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

    //USING TOKENS TO GET ALL FLOWERS
    test("GET /flower - success", async () => {
        const { body } = await request(app)
            .get("/flower")
            .set("Authorization", "Bearer " + token)

        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("FlowerList:");
    })

    //ADDING FLOWERS TO THE DATABASE
    //This test needs to have ColourId nr. 2 already created-since all my flowers needs to be connected to a colour!
    test("POST /flower - success", async () => {
        let flowerObj = {
            "Name": "Lily",
            "ColourId": 2
        }
        const { body } = await request(app)
            .post("/flower")
            .send(flowerObj)
            .set("Authorization", "Bearer " + token)
        
        expect(body).toHaveProperty("data.data");
        expect(body.data.data).toHaveProperty("Name");
        expect(body.data.data).toHaveProperty("ColourId");
        expect(body.data.data).toHaveProperty("UserId");
        expect(body.data.result).toBe("New Flower documented in database");
    });
  
    //this test needs to have an colourid nr. 1!
    test("PUT /flower/1 - success", async () => {
        let flowerObj = {
            "Name": "Tulip",
            "CategoryId": 1
        }
        const { body } = await request(app)
            .put("/flower/1")
            .send(flowerObj)
            .set("Authorization", "Bearer " + token)
          
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Flower updated successfully.");
    });

    //DELETING FLOWER FROM THE DATABASE
    //there needs to be an flower id nr. 1! 
    test("DELETE /flower - success", async () => {
        let flowerObj = {
            "id": 1
        }
        const { body } = await request(app)
            .delete("/flower")
            .send(flowerObj)
            .set("Authorization", "Bearer " + token)
            
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("You deleted a flower");
    });
    
    //TRYING TO GET FLOWERS WITHOUT SENDING JWT TOKEN IN THE HEADER
    test("GET /flower - failure", async () => {
        const { body } = await request(app)
            .get("/flower")
        
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Error! Token was not provided.");
    })

    //TRYING TO GET FLOWERS BY SENDING AN INVALID JWT TOKEN 
    test("GET /flower - failure", async () => {
        let invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJqYW5uZUB5YWhvby5jb20iLCJpYXQiOjE2ODEyOTAyOTQsImV4cCI6MTY4MTI5Mzg5NH0.6T_qA2h-r4_FINIG-yXbIb3NWqwkGZc4C5pB4k1_MwM"
        
        const { body } = await request(app)
            .get("/flower")
            .set("Authorization", "Bearer " + invalidToken)
            
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("Invalid token.");
    })
    
});