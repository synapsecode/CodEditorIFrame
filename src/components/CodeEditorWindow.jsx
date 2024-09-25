import React, { useState } from 'react'
// import copy from 'copy-to-clipboard';
import Editor from "@monaco-editor/react";


const CodeEditorWindow = ({ onChange, language, code, theme, isFullScreen, Fontoptions }) => {
    const [value, setValue] = useState(code || "")

    React.useEffect(() => {
        setValue(code)
    }, [code])
    const handleEditorChange = (value) => {
        setValue(value);
        onChange("code", value);
        // copy(value); //This continuously copies over contents into your clipboard
    };
    return (
        <div className="overlay mt-1 overflow-hidden w-full h-full shadow-4xl" >
            <Editor
                options={Fontoptions}
                height={"100%"}
                width={`100%`}
                language={language || "javascript"}
                value={value}
                theme={theme}
                autoIndent={true}
                onChange={handleEditorChange}
            />
        </div>
    )
}

export default CodeEditorWindow