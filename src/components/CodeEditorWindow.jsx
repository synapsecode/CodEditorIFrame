import React, { useState } from 'react'
// import copy from 'copy-to-clipboard';
import Editor from "@monaco-editor/react";
import { languageOptions } from '../constants/languageOptions';

export const getLangID = (lang) => {
    let matches = languageOptions.filter((e) => e.value === lang);
    let match = matches.length > 0 ? matches[0] : { id: -1 };
    return match.id;
}

const CodeEditorWindow = ({ onChange, language, code, theme, isFullScreen, Fontoptions }) => {
    const [value, setValue] = useState(code || "")

    //Sync Code Changes
    React.useEffect(() => {
        window.parent.postMessage(JSON.stringify({
            'code': value,
            'langId': getLangID(language),
        }), '*');
        setValue(code)
    }, [code])


    const handleEditorChange = (value) => {
        setValue(value);
        onChange("code", value);
        window.parent.postMessage(JSON.stringify({
            'code': value,
            'langId': getLangID(language),
        }), '*');
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