import React, { useState } from "react";
import JsonEditorWithLineNumbers from "./components/JsonEditorWithLineNumbers";
import LoadExampleButton from "./components/LoadExampleButton";
import "./components/JsonEditorWithLineNumbers.css";

function TransformPage() {
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
    <div className="w-full max-w-7xl p-8 bg-white rounded-lg shadow-lg mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Input */}
        <div className="flex-1 flex flex-col min-w-0">
          <label className="mb-2 font-semibold" htmlFor="input">Input</label>
          <JsonEditorWithLineNumbers
            id="input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onBlur={handleInputBlur}
            className="h-96"
            placeholder="Paste or type JSON input here..."
          />
        </div>
        {/* Spec */}
        <div className="flex-1 flex flex-col items-center min-w-0">
          <label className="mb-2 font-semibold self-start" htmlFor="spec">Spec</label>
          <JsonEditorWithLineNumbers
            id="spec"
            value={spec}
            onChange={e => setSpec(e.target.value)}
            onBlur={handleSpecBlur}
            className="h-96 w-full"
            placeholder="Paste or type JOLT spec here..."
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
          <JsonEditorWithLineNumbers
            id="output"
            value={output}
            readOnly
            className="h-96 bg-gray-100"
            placeholder="Transformed output will appear here..."
          />
        </div>
      </div>
      {/* Links container */}
      <div className="mt-8 flex flex-row justify-center gap-8">
        <LoadExampleButton
          label="Load Example Input & Spec"
          files={["/input.json", "/spec.json"]}
          setError={setError}
          onLoad={(inputText, specText) => {
            setInput(inputText);
            setSpec(specText);
          }}
        />
      </div>
    </div>
  );
}

export default TransformPage;

