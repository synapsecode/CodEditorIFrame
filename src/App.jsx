import React from 'react'
import CodeEditor from "./components/CodeEditor.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<CodeEditor />} />
        </Routes>
      </Router>
    </>
  )
}

export default App