import { useState } from "react";
import Editor from "@monaco-editor/react";

function OnlineCoding() {
  const [code, setCode] = useState(`// Write your JavaScript code here
function greet(name) {
  return "Hello " + name;
}

console.log(greet("Desi Developer"));
`);

  const [output, setOutput] = useState("");

  const runCode = () => {
    try {
      let consoleOutput = [];

      // Capture console.log
      const originalLog = console.log;
      console.log = (...args) => {
        consoleOutput.push(args.join(" "));
      };

      // Run user code
      eval(code);

      // Restore console.log
      console.log = originalLog;

      setOutput(consoleOutput.join("\n") || "No output");
    } catch (err) {
      setOutput(err.message);
    }
  };

  return (
    <div className="h-screen flex flex-col p-4 bg-gray-100">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">💻 Online JS Editor</h1>

      {/* Editor */}
      <div className="flex-1 rounded-xl overflow-hidden shadow-lg">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
        />
      </div>

      {/* Controls */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={runCode}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          ▶ Run Code
        </button>

        <button
          onClick={() => setCode("")}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          🗑 Clear
        </button>
      </div>

      {/* Output */}
      <div className="mt-4 bg-black text-green-400 p-4 rounded-xl min-h-[120px]">
        <h2 className="font-semibold mb-2">Output:</h2>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default OnlineCoding;
