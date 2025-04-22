import React from 'react';

const CodeEditor = ({ code }) => {
  return (
    <textarea
      className="w-full h-96 p-4 border rounded-lg font-mono text-sm"
      value={code}
      readOnly
    />
  );
};

export default CodeEditor;