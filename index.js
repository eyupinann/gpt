const express = require('express');
const swaggerUi = require('swagger-ui-express')
const cors = require('cors');
const admin = require('firebase-admin');
const swaggerFile = require('./swagger_output.json')
const authRouter = require('./controllers/auth/auth')
const chatRouter = require('./controllers/chat/chat')
const app = express();

const port = 3000;

const serviceAccount = require('./config/firebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

app.use('/chat', chatRouter);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use('/', (req, res) => {
    res.send('Welcome Chat App!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;

