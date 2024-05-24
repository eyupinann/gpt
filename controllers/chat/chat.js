const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

require('dotenv').config();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: "Too many requests from this IP, please try again later.",
});


router.post("/", authMiddleware, limiter, async (req, res) => {
    /* #swagger.security = [{
"Bearer": []
}] */

    /* 	#swagger.tags = ['Chat']
    #swagger.description = 'Endpoint to sign in a specific Test' */

    /*
     #swagger.consumes = ['application/x-www-form-urlencoded']
       #swagger.parameters['content'] = {
       in: 'formData',
       type: 'string',
       required: true,
   }

    */
    // const ip =
    //     req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const apiKey = process.env.OPENAI_API_KEY || 'sk-proj-gPVqFmWSBbNYpnaB8StWT3BlbkFJbclFQwbCudY3QdnurWsk';
    const model = process.env.GPT_MODEL_NAME || 'gpt-3.5-turbo';

    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: "user",
                    content: req.body.content,
                },
            ],
        }),
    };

    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            options
        );

        const data = await response.json();

        res.send(data);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});





module.exports = router;
