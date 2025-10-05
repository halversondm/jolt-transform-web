import React, { useRef } from "react";
import PropTypes from "prop-types";
import "./JsonEditorWithLineNumbers.css";

function getLineCount(value) {
  return value.split("\n").length;
}

const JsonEditorWithLineNumbers = ({
  value,
  onChange,
  onBlur,
  readOnly = false,
  id,
  placeholder = "",
  className = "",
}) => {
  const textareaRef = useRef(null);
  const lineCount = getLineCount(value || "");
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current) {
      const lineNumbers = textareaRef.current.parentNode.querySelector(
        ".json-editor-line-numbers"
      );
      if (lineNumbers) {
        lineNumbers.scrollTop = textareaRef.current.scrollTop;
      }
    }
  };

  return (
    <div className={`json-editor-container ${className}`.trim()}>
      <div className="json-editor-line-numbers">
        {lines.map((line) => (
          <div key={line} className="json-editor-line-number">
            {line}
          </div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        id={id}
        className="json-editor-textarea"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readOnly}
        placeholder={placeholder}
        spellCheck={false}
        onScroll={handleScroll}
        rows={24}
      />
    </div>
  );
};

JsonEditorWithLineNumbers.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  readOnly: PropTypes.bool,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default JsonEditorWithLineNumbers;

