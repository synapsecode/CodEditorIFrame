import React from 'react'
import CodeEditor from "./components/CodeEditor.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Router basename='/codeframe'>
        <Routes >
          <Route exact path="/" element={<CodeEditor />} />
          <Route exact path="/:lang" element={<CodeEditor />} />
        </Routes>
      </Router>
    </>
  )
}

export default App