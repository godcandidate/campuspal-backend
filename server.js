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
 *        201:
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
 *        201:
 *          description: Success
 *        404:
 *          description: User not found
 * 
 */
//Get user details
/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags:
 *     - User APIs
 *     summary: Get user  details
 *     description: User profile 
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - name: Authorization
 *       in: header
 *       type: string
 *       required: true
 *       description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
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
 *        201:
 *          description: Success
 *        500:
 *          description: User update failed
 * 
 */

//Upload a video
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
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: No image file uploaded
 *       500:
 *         description: Internal server error
 *       501:
 *         description: Failed uploading image to firebase storage
 */