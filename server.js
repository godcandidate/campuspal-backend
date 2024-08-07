import express from 'express';
import cors from 'cors';
import routes from './route/routes.js';

import bodyParser from 'body-parser';

const app = express();

/* middleware */
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true })); // For parsing form data
app.use(bodyParser.json());

// api swagger documentation
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const port = 8080;
/* swagger */
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "CampusPal APIs",
            version: '5.0.0'
        }
    },
    apis: ['server.js'],
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);
// route for swagger docs
routes.use('/docs', swaggerUiExpress.serve,swaggerUiExpress.setup(swaggerDocs));


// Mount the routes
app.use('/', routes); 

try {
    app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
    });
} catch (error) {
    console.log("Cannot connect to the server");
}

/* API DOCUMENTATION */
/* USERS API */
// register user
/**
 * @swagger 
 * /users/register:
 *    post:
 *      tags:
 *      - User APIs
 *      summary: Register new user
 *      description: Registering new user
 *      parameters:
 *      - name: User Credentials
 *        description: Enter user data
 *        in: body
 *        type: string
 *        required: true
 *        example: {
 *          "email" : "tdykeff609@tormails.com",
 *          "password" : "#itworks",
 *          "name" : "Prince Sanji",
 *          "phoneNumber" : "+23367817181",
 *          "college" : "Science",
 *          "department" : "Food Science",
 *          "programme" : "Food Science and Nutrition"
 *         }
 *      responses:
 *        200:
 *          description: User Registered successfully
 *        400:
 *          description: Email already in use 
 *        500:
 *          description: User not created
 * 
 */

// user login
/**
 * @swagger 
 * /users/login:
 *    post:
 *      tags:
 *      - User APIs
 *      summary: Login as user
 *      description: User logging in
 *      parameters:
 *      - name: User Credentials
 *        description: Enter user data
 *        in: body
 *        type: string
 *        required: true
 *        example: {
 *          "email" : "nkfwymc739@fatamail.com",
 *          "password" : "#special"
 *         }
 *      responses:
 *        200:
 *          description: User logged in successfully
 *        404:
 *          description: User not found
 *        500:
 *          description: Login failed, invalid user details
 * 
 */
//Get user profile
/**
 * @swagger 
 * /users/profile:
 *    get:
 *      tags:
 *      - User APIs
 *      summary: Get user profile
 *      description: User profile
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *      - name: Authorization
 *        in: header
 *        type: string
 *        required: true
 *        description: Bearer token for authentication
 *      responses:
 *        200:
 *          description: User log out successfully
 *        403:
 *          description: No user logged in
 *        500:
 *          description: Internal error 
 * 
 */

//Update
/**
 * @swagger 
 * /users/update:
 *    put:
 *      tags:
 *      - User APIs
 *      summary: Modify user data
 *      description: Changing user data
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *      - name: Authorization
 *        in: header
 *        type: string
 *        required: true
 *        description: Bearer token for authentication
 *      - name: Update user data
 *        description: Modify or add to data
 *        in: body
 *        type: string
 *        required: false
 *        example: {
 *               "name": "Yuji Itadori"
 *               }
 *      responses:
 *        200:
 *          description: User details updated successfully
 *        401:
 *         description: Missing user token
 *        402:
 *          description: User Authentication Failed
 *        500:
 *          description: User update failed
 * 
 */

// log out user
/**
 * @swagger 
 * /users/logout:
 *    post:
 *      tags:
 *      - User APIs
 *      summary: Log out user
 *      description: Logging out a user
 *      responses:
 *        200:
 *          description: User log out successfully
 *        403:
 *          description: No user logged in
 *        500:
 *          description: Internal error 
 * 
 */

//Upload a profile
/**
 * @swagger
 * /users/upload-picture:
 *   post:
 *     tags:
 *       - User APIs
 *     summary: Upload profile picture
 *     description: Upload user profile picture
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *       - in: formData
 *         name: profilePicture
 *         type: file
 *         required: true
 *         description: The image file to upload( should be less than 5mb)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: No image file uploaded
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       500:
 *         description: Internal server error
 *       501:
 *         description: Failed uploading image to firebase storage
 */

/* ORGANIZER API */
//Register an organizer
/**
 * @swagger
 * /organizers/register:
 *   post:
 *     tags:
 *       - Organizer APIs
 *     summary: Register user as event organizer
 *     description: Registering user as organizer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *       - in: body
 *         name: Organizer Credentials
 *         type: string
 *         required: true
 *         example: {
 *           "name" : "SCC",
 *           "description" : "The Student Chaplaincy Council of KNUST"
 *          }
 *     responses:
 *       200:
 *         description: User signed up as organizer successfully
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger 
 * /organizers/profile:
 *    get:
 *      tags:
 *      - Organizer APIs
 *      summary: Get Organizer  profile
 *      description: Organizer  profile
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *      - name: Authorization
 *        in: header
 *        type: string
 *        required: true
 *        description: Bearer token for authentication
 *      responses:
 *        200:
 *          description: Organizer data retreived successfully
 *        401:
 *          description: Missing user token
 *        402:
 *          description: User Authentication Failed
 *        500:
 *          description: Internal server error
 * 
 */

//Update
/**
 * @swagger 
 * /organizers/update:
 *    put:
 *      tags:
 *      - Organizer APIs
 *      summary: Modify organizer data
 *      description: Changing organizer data
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *      - name: Authorization
 *        in: header
 *        type: string
 *        required: true
 *        description: Bearer token for authentication
 *      - name: Update user data
 *        description: Modify or add to data
 *        in: body
 *        type: string
 *        required: false
 *        example: {
 *               "name": "PENSA-KNUST"
 *               }
 *      responses:
 *        200:
 *          description: User details updated successfully
 *        401:
 *         description: Missing user token
 *        402:
 *          description: User Authentication Failed
 *        500:
 *          description: User update failed
 * 
 */

//Remove
/**
 * @swagger 
 * /organizers/remove:
 *    post:
 *      tags:
 *      - Organizer APIs
 *      summary: Delete organizer account
 *      description: Deleting organizer account
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *      - name: Authorization
 *        in: header
 *        type: string
 *        required: true
 *        description: Bearer token for authentication
 *      responses:
 *        200:
 *          description: Organizer account removed successfully
 *        401:
 *         description: Missing user token
 *        402:
 *          description: User Authentication Failed
 *        500:
 *          description: Organizer account deletion failed
 * 
 */
//Get all events by an organizer
/**
 * @swagger
 * /events/organizer:
 *   get:
 *     tags:
 *     - Event APIs
 *     summary: Get all events by organizer
 *     description: Retreiving all events uploaded by an organizer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */
//Verify organizer
/**
 * @swagger
 * /organizers/verify:
 *   post:
 *     tags:
 *     - Organizer APIs
 *     summary: Verify an organizer
 *     description: Verifying an organizer before event upload
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Access granted
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       403:
 *         description: Access denied, user not an organizer
 *       500:
 *         description: Internal server error
 */
/* EVENTS API */
//Get all events
/**
 * @swagger
 * /events/all:
 *   get:
 *     tags:
 *     - Event APIs
 *     summary: Get all events details
 *     description: Retreiving all events
 *     parameters:
 *     - name: category
 *       description: Enter category to filter
 *       in: query
 *       type: string
 *       example: Religious or Educational
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 */
//Create an event
/**
 * @swagger
 * /events/add:
 *   post:
 *     tags:
 *       - Event APIs
 *     summary: Create an event
 *     description: Upload an event
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *       - in: formData
 *         name: eventImage
 *         type: file
 *         required: true
 *         description: The event image to upload
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: The name of the event
 *       - in: formData
 *         name: description
 *         type: string
 *         required: true
 *         description: The description of the event
 *       - in: formData
 *         name: category
 *         type: string
 *         required: true
 *         description: Event category
 *       - in: formData
 *         name: location
 *         type: string
 *         required: true
 *         description: The location of the event
 *       - in: formData
 *         name: startDate
 *         type: string
 *         required: true
 *         description: The date the event starts
 *       - in: formData
 *         name: endDate
 *         type: string
 *         required: true
 *         description: The date the event ends
 *       - in: formData
 *         name: contact
 *         type: string
 *         required: true
 *         description: Contact person for further details
 *     responses:
 *       201:
 *         description: Event created successfully
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       500:
 *         description: Internal server error
 */
//Get all details of an event
/**
 * @swagger
 * /events/{id}:
 *   get:
 *     tags:
 *     - Event APIs
 *     summary: Get details of an event
 *     description: Retreiving all details of an event
 *     parameters:
 *     - name: id
 *       description: Enter event id
 *       in: path
 *       type: string
 *       required: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal error
 */
//Update an event
/**
 * @swagger
 * /events/{id}:
 *   put:
 *     tags:
 *     - Event APIs
 *     summary: Update details of an event
 *     description: Updating the details of an event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     - name: Authorization
 *       in: header
 *       type: string
 *       required: true
 *       description: Bearer token for authentication
 *     - name: id
 *       description: Enter event id
 *       in: path
 *       type: string
 *       required: true
 *     - name: Update event data
 *       description: Modify event data
 *       in: body
 *       type: string
 *       required: false
 *       example: {
 *              "is_active": true
 *               }
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal error
 */

//Delete an event
/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     tags:
 *     - Event APIs
 *     summary: Delete an event
 *     description: Deleting an event
 *     parameters:
 *     - name: id
 *       description: Enter event id
 *       in: path
 *       type: string
 *       required: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 */

/* BUSINESS API */
//Get all events
/**
 * @swagger
 * /business/all:
 *   get:
 *     tags:
 *     - Business APIs
 *     summary: Get all business details
 *     description: Retreiving all businesses
 *     parameters:
 *     - name: category
 *       description: Enter category to filter
 *       in: query
 *       type: string
 *       example: Accessories or Fashion
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 */

//Get all details of an event
/**
 * @swagger
 * /business/{id}:
 *   get:
 *     tags:
 *     - Business APIs
 *     summary: Get details of a business
 *     description: Retreiving all details of a business
 *     parameters:
 *     - name: id
 *       description: Enter business id
 *       in: path
 *       type: string
 *       required: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal error
 */

//Register a business
/**
 * @swagger
 * /business/register:
 *   post:
 *     tags:
 *       - Business APIs
 *     summary: Create a business
 *     description: Register your business
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: The name of the business
 *       - in: formData
 *         name: description
 *         type: string
 *         required: true
 *         description: The description of the business
 *       - in: formData
 *         name: address
 *         type: string
 *         required: true
 *         description: Your location
 *       - in: formData
 *         name: contact
 *         type: string
 *         required: true
 *         description: The business official contact
 *     responses:
 *       201:
 *         description: Business created successfully
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       500:
 *         description: Internal server error
 */

//Get user business details
/**
 * @swagger
 * /business/profile:
 *   get:
 *     tags:
 *     - Business APIs
 *     summary: Get business details of user
 *     description: Retreiving all details of a user business
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */
//Upload a business logo
/**
 * @swagger
 * /business/logo:
 *   post:
 *     tags:
 *       - Business APIs
 *     summary: Upload business logo
 *     description: Upload a logo for your business
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *       - in: formData
 *         name: businessLogo
 *         type: file
 *         required: true
 *         description: The business logo to upload
 *     responses:
 *       201:
 *         description: Business logo uploaded successfully
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       500:
 *         description: Internal server error
 */
//Update business
/**
 * @swagger
 * /business/update:
 *   put:
 *     tags:
 *     - Business APIs
 *     summary: Update details of a business
 *     description: Updating the details of a business
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     - name: Authorization
 *       in: header
 *       type: string
 *       required: true
 *       description: Bearer token for authentication
 *     - name: id
 *       description: Enter business id
 *       in: path
 *       type: string
 *       required: true
 *     - name: Update event data
 *       description: Modify event data
 *       in: body
 *       type: string
 *       required: false
 *       example: {
 *              "name": "Eddie Collections"
 *               }
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       500:
 *         description: Internal server error
 */
//Delete a business
/**
 * @swagger
 * /business/delete:
 *   delete:
 *     tags:
 *     - Business APIs
 *     summary: Delete user business
 *     description: Removing user business
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       500:
 *         description: Internal server error
 */
//Verify business
/**
 * @swagger
 * /business/verify:
 *   post:
 *     tags:
 *     - Business APIs
 *     summary: Verify a business owner
 *     description: Verifying a business before product upload
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Access granted
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       403:
 *         description: Access denied, user not a business owner
 *       500:
 *         description: Internal server error
 */
/* Product API */
//Get all products
/**
 * @swagger
 * /products/all:
 *   get:
 *     tags:
 *     - Product APIs
 *     summary: Get all products
 *     description: Retreiving all products
 *     parameters:
 *     - name: name
 *       description: Enter name to filter
 *       in: query
 *       type: string
 *       example: Iphone
 *     - name: category
 *       description: Enter category to filter
 *       in: query
 *       type: string
 *       example: Electronics or Fashion
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */
//View product
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *     - Product APIs
 *     summary: View product
 *     description: Viewing a product
 *     parameters:
 *     - name: id
 *       description: Enter product id
 *       in: path
 *       type: string
 *       required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
//Add a product
/**
 * @swagger
 * /products/add:
 *   post:
 *     tags:
 *       - Product APIs
 *     summary: Add a business product
 *     description: Adding a business product
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *       - in: formData
 *         name: productImage
 *         type: file
 *         required: true
 *         description: The product image to upload
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: The name of the product
 *       - in: formData
 *         name: description
 *         type: string
 *         description: The description of the product
 *       - in: formData
 *         name: category
 *         type: string
 *         required: true
 *         description: The product category
 *       - in: formData
 *         name: price
 *         type: number
 *         required: true
 *         description: The price of the product
 *     responses:
 *       201:
 *         description: Product added successfully
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       404:
 *         description: User is not a business owner
 *       500:
 *         description: Internal server error
 */
//Get all products for a business
/**
 * @swagger
 * /products/business:
 *   get:
 *     tags:
 *     - Product APIs
 *     summary: Get all products by business
 *     description: Retreiving all products by a business
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */
//Update product
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags:
 *     - Product APIs
 *     summary: Update details of a product
 *     description: Updating product details
 *     parameters:
 *     - name: id
 *       description: Enter product id
 *       in: path
 *       type: string
 *       required: true
 *     - name: Update product data
 *       description: Modify product data
 *       in: body
 *       type: string
 *       required: false
 *       example: {
 *              "price": 100.00
 *               }
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
//Delete product
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags:
 *     - Product APIs
 *     summary: Delete a business product
 *     description: Deleting a product
 *     parameters:
 *     - name: id
 *       description: Enter product id
 *       in: path
 *       type: string
 *       required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
//Get all items
/**
 * @swagger
 * /founditems:
 *   get:
 *     tags:
 *     - Lost and Found APIs
 *     summary: Get all items
 *     description: Retreiving all items
 *     parameters:
 *     - name: name
 *       description: Enter name to filter
 *       in: query
 *       type: string
 *       example: Iphone
 *     - name: category
 *       description: Enter category to filter
 *       in: query
 *       type: string
 *       example: Electronics or Fashion
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */
//Add a lost card
/**
 * @swagger
 * /founditems/card:
 *   post:
 *     tags:
 *       - Lost and Found APIs
 *     summary: Add a found card item
 *     description: Upload a card item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *       - name: Item details
 *         description: Enter item data
 *         in: body
 *         type: string
 *         required: true
 *         example: {
 *           "type" : "otherID",
 *           "category" : "card",
 *           "name" : "Joe A Sample", 
 *           "dateOfBirth" : "01/01/71" ,
 *           "index_number" : "",
 *           "ref_number" : ""  
 *          }
 *     responses:
 *       201:
 *         description: Added lost card  successfully
 *       401:
 *         description: Missing user token
 *       402:
 *         description: User Authentication Failed
 *       500:
 *         description: Internal server error
 */
//Get all products for a business
/**
 * @swagger
 * /founditems/user:
 *   get:
 *     tags:
 *     - Lost and Found APIs
 *     summary: Get all found items by user
 *     description: Retreiving all found items by user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */


//Update an item
/**
 * @swagger
 * /founditems/{id}:
 *   put:
 *     tags:
 *     - Lost and Found APIs
 *     summary: Update details of a found item
 *     description: Updating item details
 *     parameters:
 *     - name: id
 *       description: Enter tem id
 *       in: path
 *       type: string
 *       required: true
 *     - name: Update product data
 *       description: Modify product data
 *       in: body
 *       type: string
 *       required: false
 *       example: {
 *              "name": "Tester"
 *               }
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
//Delete product
/**
 * @swagger
 * /founditems/{id}:
 *   delete:
 *     tags:
 *     - Lost and Found APIs
 *     summary: Delete a found item
 *     description: Deleting a found item
 *     parameters:
 *     - name: id
 *       description: Enter item id
 *       in: path
 *       type: string
 *       required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
//Get all products for a business
/**
 * @swagger
 * /founditems/claimcard/{id}:
 *   post:
 *     tags:
 *     - Lost and Found APIs
 *     summary: Claim a found item
 *     description: User claiming a found item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *       - name: id
 *         description: Enter tem id
 *         in: path
 *         type: string
 *         required: true
 *       - name: Data to match
 *         description: Data to match found item
 *         in: body
 *         type: string
 *         required: false
 *         example: {
 *              "ref_number": "Tester",
 *              "dateOfBirth": "Tester",
 *               }
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */

/* Notifications API */
//Get all notifications for a user
/**
 * @swagger
 * /notifications/user:
 *   get:
 *     tags:
 *     - Notification APIs
 *     summary: Get all notifications of user
 *     description: Retreiving all notification of a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */

/* REPORT */
//Add a report
/**
 * @swagger
 * /reports/add:
 *   post:
 *     tags:
 *     - Report APIs
 *     summary: Report an Object
 *     description: Reporting an object
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *       - name: id
 *         description: Enter tem id
 *         in: path
 *         type: string
 *         required: true
 *       - name: Data to match
 *         description: Data to match found item
 *         in: body
 *         type: string
 *         required: false
 *         example: {
 *              "objectId": "",
 *              "type": "Event",
 *              "message": "",
 *              "date": "31/07/2024",
 *               }
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */
/* Product API */
//Get all products
/**
 * @swagger
 * /reports/all:
 *   get:
 *     tags:
 *     - Report APIs
 *     summary: Get all products
 *     description: Retreiving all products
 *     parameters:
 *     - name: type
 *       description: Enter type to filter(Event, Product, Item)
 *       in: query
 *       type: string
 *       example: Event
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */

                                                /* ADMIN API */

/* Admin APIs/ dashbaord */
//Get all users
/**
 * @swagger
 * /users/all:
 *   get:
 *     tags:
 *     - Admin APIs/ dashboard
 *     summary: Get number of  users
 *     description: Retreiving total number of users
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */
//Get all normal users
/**
 * @swagger
 * /users/count:
 *   get:
 *     tags:
 *     - Admin APIs/ dashboard
 *     summary: Get number of normal users
 *     description: Retreiving total number of normal users
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */
//Get all organizers
/**
 * @swagger
 * /organizers/count:
 *   get:
 *     tags:
 *     - Admin APIs/ dashboard
 *     summary: Get number of organizers
 *     description: Retreiving total number of organizers
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */
//Get all events
/**
 * @swagger
 * /events/count:
 *   get:
 *     tags:
 *     - Admin APIs/ dashboard
 *     summary: Get total number of events
 *     description: Retreiving total number of events
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */
//Get all user details
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *     - Admin APIs/ dashboard
 *     summary: Get all users
 *     description: Retreiving names, emails and phone numbers for all users
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */
//Get all found items
/**
 * @swagger
 * /foundItems/count:
 *   get:
 *     tags:
 *     - Admin APIs/ dashboard
 *     summary: Get number of  found items
 *     description: Retreiving total number of found items
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */

/* Admin APIs/ Organization */
//Get all organizers
/**
 * @swagger
 * /organizers:
 *   get:
 *     tags:
 *     - Admin APIs/ Organization
 *     summary: Get all organizers
 *     description: Retreiving organizer names, organization name and number of events posted for all users
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */
//Get all events
/**
 * @swagger
 * /events/count:
 *   get:
 *     tags:
 *     - Admin APIs/ Organization
 *     summary: Get number of events posted
 *     description: Retreiving number of events available
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */

/* Admin APIs/ Business */
//Get all number of business
/**
 * @swagger
 * /business/count:
 *   get:
 *     tags:
 *     - Admin APIs/ Business
 *     summary: Get total number of business
 *     description: Retreiving total number of business
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful
 */
/**
 * @swagger
 * /business:
 *   get:
 *     tags:
 *     - Admin APIs/ Business
 *     summary: Get all business
 *     description: Retreiving all business owners, names and number of products posted for all users
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful 
 */
//Get all products
/**
 * @swagger
 * /products/count:
 *   get:
 *     tags:
 *     - Admin APIs/ Business
 *     summary: Get total number of products
 *     description: Retreiving number of products available
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful 
 */
/* Admin APIs/ Lost and found */
//Get all found items
/**
 * @swagger
 * /foundItems/all:
 *   get:
 *     tags:
 *     - Admin APIs/ Lost and found
 *     summary: Get total number of products
 *     description: Retreiving number of products available
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Retrieval not successful 
 */