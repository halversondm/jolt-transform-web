import React from "react";

function LoadExampleButton({ label, files, onLoad, setError }) {
  return (
    <button
      className="text-blue-600 underline hover:text-blue-800"
      onClick={async () => {
        setError("");
        try {
          const responses = await Promise.all(files.map(f => fetch(f)));
          if (responses.some(res => !res.ok)) {
            throw new Error("Failed to load files");
          }
          const texts = await Promise.all(responses.map(res => res.text()));
          onLoad(...texts);
        } catch {
          setError("Failed to load input or spec file");
        }
      }}
    >
      {label}
    </button>
  );
}

export default LoadExampleButton;

