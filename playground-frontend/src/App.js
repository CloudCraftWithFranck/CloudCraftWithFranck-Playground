import React, { useState } from "react";
import axios from "axios";
import TerminalComponent from "./Terminal";

const App = () => {
    const [repoUrl, setRepoUrl] = useState("");
    const [containerId, setContainerId] = useState(null);
    const [message, setMessage] = useState("");

    const handleCloneRepo = async () => {
        try {
            const response = await axios.post("http://localhost:3001/clone", {
                repoUrl,
            });
            setMessage(response.data.message);
            setContainerId(response.data.path); // Use this for a real Docker container
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    const handleCreateContainer = async () => {
        try {
            const response = await axios.post("http://localhost:3001/create-container");
            setMessage(response.data.message);
            setContainerId(response.data.containerId);
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div>
            <h1>Playground Integration</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter GitHub Repository URL"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                />
                <button onClick={handleCloneRepo}>Clone Repo</button>
            </div>
            <div>
                <button onClick={handleCreateContainer}>Create WSL-Like Container</button>
            </div>
            <p>{message}</p>
            {containerId && <TerminalComponent containerId={containerId} />}
        </div>
    );
};

export default App;
