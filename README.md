# TheGarden REST API application

![Banner](/public/images/banner.jpg)


This is a project where i have created the REST API endpoints for "TheGarden" Application, 
which allows users to create, view, update and delete Flowers.

Say your in the garden with other users and you are picking flowers and sorting them into the database.
Each flower has a name and a Colour. 
The colour needs to be implemented first then you can sort the flower into the right colourId creating a garden on your own.

This is a project that ive built that focuses on:

* REST API
* javascript
* MySQL
* JEST
* postman documentation

Only the back-end is created. The application is using JWT authentication, and the response in in JSON format. 
All the data is stored in a MySQL database called "TheGarden" (check out the .env file credentials below)

# Application Installation and Usage Instructions

- First install the neccessary dependency with the command -- npm install

## Additional Libraries/Packages
- __It will install these dependencies:__ 
    - cookie-parser: ~1.4.4,
    - debug: ~2.6.9,
    - dotenv: ^16.0.3,
    - ejs: ^3.1.8,
    - express: ^4.18.2,
    - http-errors: ~1.6.3,
    - jsend: ^1.1.0,
    - jsonwebtoken: ^9.0.0,
    - morgan: ~1.9.1,
    - mysql: ^2.18.1,
    - mysql2: ^3.1.2,
    - sequelize: ^6.29.0,
    - supertest: ^6.3.3,
    - jest: ^29.5.0

### DATABASE SETUP

To make this application work you need to setup an database in MySQL. 

* This will make a database called TheGarden:
    - CREATE SCHEMA TheGarden;
* This will create the database user:
    - CREATE USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';
ALTER USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';
GRANT ALL PRIVILEGES ON TheGarden.* TO 'admin'@'localhost';
* Then create database tables and relationships using Sequalize: 
    - start the application in Visual Studio Code with the command: npm start
    - Then go to MySQL database and create a relationship diagram as shown in the picture bellow.
* Tables:
    - colours
    - flowers
    - users

![RelationshipDiagram](/public/images/RelationshipDiagram.jpg)


### AUTHENTICATION

* Passwords are encrypted on the API endpoints, and then saved in the database.
* JWT token is provided when a user logs in and is used to authenticate the user all through the application.
    * Authenticated users are able to:
        - View the list of all their Flowers
        - View the list of all the Colours
        - Add new Flowers for them
        - Add new Colour
        - Edit existing Flowers for a selected id or name
        - Edit existing Colour for a selected id or name
        - Deleting an existing Flower for a selected id or name
        - Deleting an existing Colour for a selected id or name if its not connected to a Flower.
        - Deleting a user

### TESTING

Testing using JEST and Supertest 

* flower.test.js
    * Logging in with a valid account and saving the JWT token 
    * Using tokens to get all Flowers.
    * Adding Flowers to the database.
    * Deleting Flowers from the database.
    * Trying to get Flowers without sending JWT token in the header.
    * Trying to get Flowers by sending an invalid JWT token.
    * Changing the Flower from the database.
* colour.test.js
    * Logging in with a valid account and saving the JWT token 
    * Using tokens to get list of colours.
    * Adding colours to the database.
    * Changing the colours from the database.
    * Deleting colours from the database.
* auth.test.js
    * Signing up to a test account
    * Loging in with the test account
    * Deleting the test account

* _For some of the testing they need data implemented into the database beforehand,
 it is stated in the code above each test what they need_

- the user needs to be signed up so the token can be retreved when the test login
- the colour may need to be there so it can be changed and deleted by id number / and the flowers needs it.
- the flowers may need to be there so it can be changed and deleted by id number.

* here are the database data requirements needed:
    - user: {
    "name": "John",
    "email": "johndoe@yahoo.com",
    "password": "0000"
    }
    - colour id 1: {
    "name": "red"
    }
    - colour id 2: {
    "name": "blue"
    }
    - flower id 1: {
    "Name": "rose",
    "ColourId": 1
    }


# Environment Variables

- HOST = "localhost"
- ADMIN_USERNAME = "admin"
- ADMIN_PASSWORD = "P@ssw0rd"
- DATABASE_NAME = "TheGarden"
- DIALECT = "mysql"
- PORT = "3000"
- TOKEN_SECRET =

instructions to get the token secret:
command in terminal:
node
require('crypto').randomBytes(64).toString('hex')


# NodeJS Version Used

v18.12.1

# POSTMAN Documentation link

Postman documentation link where i tested all the API endpoints:
https://documenter.getpostman.com/view/26263171/2s93XyTiH3


## Contributing
ME :butterfly: Yes me :)
**Signed: Janne Marie Tvetene**



