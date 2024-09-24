import React, { useEffect, useState } from 'react'
import CodeEditorWindow from "./CodeEditorWindow";
import { languageOptions } from "../constants/languageOptions";
import { snippet } from "../constants/snippet";
import './codeEditor.css'
import { FaRegCopy } from 'react-icons/fa';
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../lib/defineTheme"
import LanguagesDropdown from './LanguageDropdown';
import ThemeDropdown from './ThemeDropdown';
import copy from 'copy-to-clipboard';
import executeCodeOnJudge0 from '../utils/codeexecute'


//Compiler API  deploy on server:  https://github.com/Jaagrav/CodeX-API/tree/master/executeCode
//Realtime code update : https://github.com/RisingGeek/CodeEditor

const defaultCode = `// Type Your code here 1`;
const CodeEditor = () => {

    function loadTheme() {
        let th = { label: 'Blackboard', value: 'blackboard', key: 'blackboard' }
        if (localStorage.getItem("usertheme")) {
            console.log("update theme from local storage");
            th = JSON.parse(localStorage.getItem("usertheme"))
        }
        return th;

    }

    const [code, setCode] = useState(defaultCode);
    const [theme, setTheme] = useState("");
    const [font_size, set_font_size] = useState(16)
    const [language, setLanguage] = useState(JSON.parse(localStorage.getItem("language")) || languageOptions[0]);


    const onChange = (action, data) => {
        switch (action) {
            case "code": {
                setCode(data);
                window.localStorage.setItem(language.value, JSON.stringify(data))
                break;
            }

            default: {
                console.warn("case not handled!", action, data);
            }
        }
    };


    useEffect(() => {
        const prevCode = JSON.parse(localStorage.getItem(language.value));
        setCode(prevCode || snippet(language.value));
    }, [language.value]);


    const onSelectChange = (sl) => {
        setLanguage(sl);
        localStorage.setItem("language", JSON.stringify(sl));
    };

    async function handleThemeChange(th) {
        const theme = th;

        console.log(theme);
        if (["light", "vs-dark"].includes(theme.value)) {
            setTheme(theme);
        } else {

            console.log("calling define theme ");
            defineTheme(theme.value)
                .then((_) => {

                    setTheme(theme);
                    localStorage.setItem("usertheme", JSON.stringify(theme));
                })
        }

    }

    const handleCompile = () => {
        const apiKey = '41599ae506msh68285b0f476e7aep1fe9d9jsn13b33e53059e';
        executeCodeOnJudge0({
            langId: language.id,
            codestring: code,
            stdin: "",
        },
            apiKey,
        ).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.error(err);
        });

    };

    useEffect(() => {
        let th = loadTheme();
        console.log("calling define theme from useEffect")
        handleThemeChange(th);
    }, []);

    const copyToClipboard = () => {
        copy(code);
    }

    return (
        <>
            <div className="flex flex-row border-2 border-t-0 border-gray-600 gap-4" >
                <br />

                <div className="dropdownInner">
                    <LanguagesDropdown onSelectChange={onSelectChange} Userlanguage={language} />
                </div>
                <div className="dropdownInner">
                    <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
                </div>

                <div className="px-4 justify-end">
                    <div className="d-flex px-2 py-1 rounded-lg border focus:outline-none hover:bg-gray-700 hover:text-blue-700 focus:z-10  focus:ring-gray-500 bg-gray-800 border-gray-600 hover:text-white hover:bg-gray-700">
                        <label htmlFor="fontsize_lable" className="form-label mr-2 text-gray-100">Font Size</label>
                        <input
                            type="number"
                            className="form-control px-3 py-1  text-gray-700 bg-white  border border-solid border-gray-300 rounded transition ease-in-out m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            id="fontsize_lable"
                            placeholder="Font size"
                            value={font_size}
                            onChange={(e) => set_font_size(parseInt(e.target.value))}
                            style={{
                                width: "80px"
                            }}
                        />
                    </div>
                </div>


                <div className="px-4  mx-auto justify-end flex items-center" style={{
                    flex: 1
                }} >

                    <button onClick={copyToClipboard} type="button" id="copytxt" className="flex items-center py-2 px-4 mr-3  text-xs font-medium  rounded-lg border focus:outline-none hover:bg-gray-700 hover:text-blue-700 focus:z-10  focus:ring-gray-500 bg-gray-800 border-gray-600 hover:text-white hover:bg-gray-700">
                        <FaRegCopy fontSize={18} color="white" />
                    </button>

                    <button

                        onClick={handleCompile} type="button" className="text-white bg-indigo-600 hover:bg-indigo-800   focus:outline-none font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center focus:ring-[#2557D6]/50 mr-2">
                        {
                            "Compile Code"
                        }
                    </button>
                </div>
            </div >

            < div className="editorlayout flex flex-row  space-x-4 items-start border-2 border-t-0 border-b-0 border-gray-600"
                style={{
                    height: `calc(100vh - 6.4vh )`,
                }}>
                <CodeEditorWindow
                    code={code}
                    Fontoptions={{
                        fontSize: font_size
                    }}
                    onChange={onChange}
                    language={language?.value}
                    theme={theme.value}
                    isFullScreen={false}
                />
            </div >
        </>
    )
}

export default CodeEditor;