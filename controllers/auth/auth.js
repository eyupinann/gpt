const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { verifyToken, secretKey } = require('../../auth');
const admin = require('firebase-admin');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.post('/login', async (req, res) => {
    /*
     #swagger.consumes = ['application/x-www-form-urlencoded']
     #swagger.parameters['username'] = {
         in: 'formData',
         type: 'string',
         required: true,
     }
     */
    const { username } = req.body;

    try {
        let userRecord;
        try {
            userRecord = await admin.auth().getUserByEmail(username + '@example.com');
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                userRecord = await admin.auth().createUser({
                    email: username + '@example.com',
                    displayName: username,
                });
            } else {
                throw error.code;
            }
        }

        const customToken = jwt.sign({ userId: userRecord.uid }, secretKey);


        await admin.firestore().collection('users').doc(userRecord.uid).set({
            username: userRecord.displayName,
            email: userRecord.email,
        });

        res.json({ token: customToken });
    } catch (error) {
        console.error('Error creating or retrieving chat:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
