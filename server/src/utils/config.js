const dotenv = require('dotenv');
dotenv.config();

const config = {
    groqApiKey: process.env.GROQ_API_KEY,
    port: process.env.PORT || 3000,
};

module.exports = { 
    config 
};
