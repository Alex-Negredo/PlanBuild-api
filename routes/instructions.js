const express = require('express');
const router = express.Router();
const fs = require('fs');

// Get all instructions

// router.get('/instructions', (req, res) => {
//     fs.readFile('../data/instructions.json', 'utf8', (err, data) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).send('error reading instructions');
//         }
//         res.json(JSON.parse(data)); // review
//     })
// })

module.exports = router;