import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Hello World from Gemini AI Server',
    });
});

app.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).send({ error: 'Invalid prompt input' });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        return res.status(200).send({
            bot: result.response.text(),
        });

    } catch (error) {
        res.status(500).send({ 
            error: 'Internal Server Error. Please try again later.',
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gemini AI server started on http://localhost:${PORT}`));
