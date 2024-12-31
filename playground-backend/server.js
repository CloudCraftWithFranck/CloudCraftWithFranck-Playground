const express = require("express");
const simpleGit = require("simple-git");
const path = require("path");
const Docker = require("dockerode");

const app = express();
app.use(express.json());

const git = simpleGit();
const docker = new Docker();

// Route to clone GitHub repository
app.post("/clone", async (req, res) => {
    const { repoUrl } = req.body;
    const localPath = path.join(__dirname, "repos", Date.now().toString()); // Unique folder for each repo
    try {
        await git.clone(repoUrl, localPath);
        res.json({ message: "Repository cloned successfully", path: localPath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to create a Docker container (WSL simulation)
app.post("/create-container", async (req, res) => {
    try {
        const container = await docker.createContainer({
            Image: "ubuntu:20.04", // Ubuntu image to simulate WSL
            Cmd: ["/bin/bash"],
            Tty: true,
        });
        await container.start();
        res.json({ message: "Container started", containerId: container.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to execute commands in the Docker container
app.post("/exec", async (req, res) => {
    const { containerId, command } = req.body;
    const container = docker.getContainer(containerId);
    const exec = await container.exec({
        Cmd: command.split(" "),
        AttachStdout: true,
        AttachStderr: true,
    });
    const stream = await exec.start();
    stream.on("data", (data) => {
        res.write(data.toString());
    });
    stream.on("end", () => {
        res.end();
    });
});

app.listen(3001, () => {
    console.log("Backend is running on http://localhost:3001");
});

app.get("/", (req, res) => {
    res.send("Welcome to the Playground Backend API");
});
