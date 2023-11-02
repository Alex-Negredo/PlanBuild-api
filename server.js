const express = require('express');
const cors = require('cors');
const app = express();
// const port = 8080;
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
        return cb(null, './public')
        console.log(cb);
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage})

app.get('/', (req, res) => {
    res.send('<h1>Alex PlanBuild Server</h1>')
})

// Get all the projects OK
app.get('/planbuild/projects', (req, res) => {
    fs.readFile('./data/projects.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading projects:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const projects = JSON.parse(data);
        res.json(projects);
        console.log('Success getting projects');
    })
})

// Get a single project by ID OK
app.get('/planbuild/projects/:projectId', (req, res) => {
    fs.readFile('./data/projects.json', 'utf8', (err, data) => {
        if(err) {
            return res.send("error getting project with id" + req.params.projectId);
        }
        // search array for project with matching id
        const projects = JSON.parse(data); // Getting the whole array from './data/projects.json', defining as 'projects' and parsing the JSON data.
        const selectedProject = projects.find(project => project.id == req.params.projectId);
        res.json(selectedProject);
    })
})

// Get all the instructions from a single project OK
app.get('/planbuild/projects/:projectId/instructions', (req, res) => {
    fs.readFile('./data/projects.json', 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading the file:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Getting the whole array from './data/projects.json', defining as 'projects' and parsing the JSON data.
        const projects = JSON.parse(data);

        // Find the project with the specified ID
        const selectedProject = projects.find(project => project.id == req.params.projectId);
        // Retrieve and return the instructions for the project
        const allInstructions = selectedProject?.instructions;
        res.json(allInstructions);
    })
})

// Get a single instruction from a single project
app.get('/planbuild/projects/:projectId/instructions/:instructionId', (req, res) => {
    fs.readFile('./data/projects.json', 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading the file:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Getting the whole array from './data/projects.json', defining as 'projects' and parsing the JSON data.
        const projects = JSON.parse(data);

        // Find the project with the specified ID
        const selectedProject = projects.find(project => project.id == req.params.projectId);
        const allInstructions = selectedProject.instructions;
        // Find the instruction with the specified ID
        const selectedInstruction = allInstructions.find(instruction => instruction.id == req.params.InstructionId);
        res.json(selectedInstruction);
    })
})

// Get all the spces from a single project
app.get('/planbuild/projects/:projectId/specifications', (req, res) => {
    fs.readFile('./data/projects.json', 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading the file:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Getting the whole array from './data/projects.json', defining as 'projects' and parsing the JSON data.
        const projects = JSON.parse(data);

        // Find the project with the specified ID
        const selectedProject = projects.find(project => project.id == req.params.projectId);
        // Retrieve and return the instructions for the project
        const allSpecifications = selectedProject.specifications;
        res.json(allSpecifications);
    })
})

// Get a single spec from a single project
app.get('/planbuild/projects/:projectId/specifications/:specificationId', (req, res) => {
    fs.readFile('./data/projects.json', 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading the file:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Getting the whole array from './data/projects.json', defining as 'projects' and parsing the JSON data.
        const projects = JSON.parse(data);

        // Find the project with the specified ID
        const selectedProject = projects.find(project => project.id == req.params.projectId);
        // Find the instruction with the specified ID
        const selectedSpecification = selectedProject.specifications.find(specifications => specifications.id == req.params.specificationId);
        res.json(selectedSpecification);
    })
})


// Get all PDF files
app.get('/public', (req, res) => {
    fs.readFile('./data/projects.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('error reading instructions')
        }
        res.json(JSON.parse(data))
    })
})



// Post a new instruction
app.post('/planbuild/projects/:projectId/instructions', upload.single('file'), (req, res) => {
    const projectId = req.params.projectId;

    fs.readFile('./data/projects.json', 'utf8', (err, data) => {
        if (err) {
            res.send('error uploading Instruction, please try again');
        }
        const projects = JSON.parse(data);

        // Find the project with the matching projectId
        const selectedProject = projects.find((project) => project.id == projectId);

        const newInstruction = {
            id: uuidv4(),
            number: req.body.number,
            title: req.body.title,
            createdBy: req.body.createdBy,
            trade: req.body.trade,
            dateIssued: new Date().toLocaleDateString(),
            status: req.body.status,
            type: req.body.type,
            path: `https://planbuild-api-2aa57d725286.herokuapp.com/${req.file.filename}`
        }

        selectedProject.instructions.push(newInstruction);

        fs.writeFile('./data/projects.json', JSON.stringify(projects), (err) => {
            if(err) {
                console.error(err);
                return res.send('error saving new Instruction');
            }
            res.json(newInstruction);
            console.log(newInstruction);
        })
    })
})



// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT} 🥸`);
});