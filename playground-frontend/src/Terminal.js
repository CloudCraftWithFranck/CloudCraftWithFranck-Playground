import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import axios from "axios";

const TerminalComponent = ({ containerId }) => {
    const terminalRef = useRef(null);

    useEffect(() => {
        const terminal = new Terminal();
        terminal.open(terminalRef.current);

        terminal.onData(async (data) => {
            const response = await axios.post("http://localhost:3001/exec", {
                containerId,
                command: data.trim(),
            });
            terminal.write(response.data);
        });

        return () => {
            terminal.dispose();
        };
    }, [containerId]);

    return <div ref={terminalRef} style={{ height: "500px" }} />;
};

export default TerminalComponent;
