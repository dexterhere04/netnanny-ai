const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000; // You can change this if needed

// Middleware to allow CORS (optional but useful)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve static files from the NNAI directory explicitly
app.use('/NNAI', express.static(path.join(__dirname, 'NNAI')));

// Route to serve index.html from the root path `/`
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'NNAI', 'index.html')); // Now correctly serves index.html
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
