const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

app.use(cors())
app.use(express.json())

//middleware to use a public folder, to server images or pdf
app.use(express.static('public'));

// middleware to upload PDF files
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, './public/Instructions')
        console.log(cb);
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage})

app.get('/', (req, res) => {
    res.send('<h1>Alex Server</h1>')
})


// Get all instructions
app.get('/instructions', (req, res) => {
    fs.readFile('./data/instructions.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('error reading instructions')
        }
        res.json(JSON.parse(data))
    })
})


// Get a single instruction by ID
app.get('/instructions/:id', (req, res) => {
    fs.readFile('./data/instructions.json', 'utf8', (err, data) => {
        if(err) {
            return res.send("error getting instruction with id" + req.params.id);
        }
        // search array for instruction with matching id
        const instructions = JSON.parse(data);
        const foundInstruction = instructions.find(instruction => instruction.id === req.params.id);
        res.json(foundInstruction);
    })
})


app.post('/instructions', upload.single('file'), (req, res) => {

    fs.readFile('./data/instructions.json', 'utf8', (err, data) => {
        if (err) {
            res.send('error uploading Instruction, please try again');
        }
        const instructions = JSON.parse(data);

        const newInstruction = {
            id: uuidv4(),
            number: req.body.number,
            title: req.body.title,
            createdBy: req.body.createdBy,
            trade: req.body.trade,
            dateIssued: new Date().toLocaleDateString()
        }

        instructions.push(newInstruction);

        fs.writeFile('./data/instructions.json', JSON.stringify(instructions), (err) => {
            if(err) {
                console.error(err);
                return res.send('error saving new Instruction');
            }
            res.json(newInstruction);
        })
    })
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});