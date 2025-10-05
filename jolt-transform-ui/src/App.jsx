import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [spec, setSpec] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pretty-print JSON if valid, else return original
  const tryFormatJson = (value) => {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  };

  const handleInputBlur = () => {
    setInput(tryFormatJson(input));
  };

  const handleSpecBlur = () => {
    setSpec(tryFormatJson(spec));
  };

  const handleTransform = async () => {
    setLoading(true);
    setError("");
    setOutput("");
    let inputObj, specObj;
    try {
      inputObj = input ? JSON.parse(input) : {};
    } catch (e) {
      setError("Input is not valid JSON");
      setLoading(false);
      return;
    }
    try {
      specObj = spec ? JSON.parse(spec) : {};
    } catch (e) {
      setError("Spec is not valid JSON");
      setLoading(false);
      return;
    }
    const body = {
      input: inputObj,
      spec: specObj,
      output: null
    };
    try {
      const response = await fetch("/api/v1/jolt/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        setError("Transformation failed");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setOutput(JSON.stringify(data.output, null, 2));
    } catch (e) {
      setError("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-7xl p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Input */}
          <div className="flex-1 flex flex-col min-w-0">
            <label className="mb-2 font-semibold" htmlFor="input">Input</label>
            <textarea
              id="input"
              className="border rounded p-2 h-96 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-base min-w-0"
              value={input}
              onChange={e => setInput(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>
          {/* Spec */}
          <div className="flex-1 flex flex-col items-center min-w-0">
            <label className="mb-2 font-semibold self-start" htmlFor="spec">Spec</label>
            <textarea
              id="spec"
              className="border rounded p-2 h-96 resize-none w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-base min-w-0"
              value={spec}
              onChange={e => setSpec(e.target.value)}
              onBlur={handleSpecBlur}
            />
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              onClick={handleTransform}
              disabled={loading}
            >
              {loading ? "Transforming..." : "Transform"}
            </button>
            {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
          </div>
          {/* Output */}
          <div className="flex-1 flex flex-col min-w-0">
            <label className="mb-2 font-semibold" htmlFor="output">Output</label>
            <textarea
              id="output"
              className="border rounded p-2 h-96 resize-none bg-gray-100 focus:outline-none text-base min-w-0"
              value={output}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
