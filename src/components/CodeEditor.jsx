import React, { useEffect, useState } from 'react'
import CodeEditorWindow from "./CodeEditorWindow";
import { languageOptions } from "../constants/languageOptions";
// import { snippet } from "../constants/snippet";
import './codeEditor.css'
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../lib/defineTheme"
import LanguagesDropdown from './LanguageDropdown';
import ThemeDropdown from './ThemeDropdown';
import executeCodeOnJudge0 from '../utils/codeexecute'
import { useParams } from 'react-router-dom';
import { getLangID } from './CodeEditorWindow';


const defaultCode = `// Type Your code here`;
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
    const [language, setLanguage] = useState(languageOptions[0]);
    let { lang } = useParams();


    const onChange = (action, data) => {
        switch (action) {
            case "code": {
                setCode(data);
                // window.localStorage.setItem(language.value, JSON.stringify(data))
                break;
            }

            default: {
                console.warn("case not handled!", action, data);
            }
        }
    };

    // useEffect(() => {
    //     setCode(snippet(language.value));
    //     console.log('Initial CodeSync Completed', snippet(language.value));
    //     window.parent.postMessage(JSON.stringify({
    //         'code': snippet(language.value),
    //         'langId': getLangID(language),
    //     }), '*');
    // }, [language]);

    const onSelectChange = (sl) => {
        setLanguage(sl);
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

    // const compileCode = () => {
    //     const apiKey = '41599ae506msh68285b0f476e7aep1fe9d9jsn13b33e53059e';
    //     executeCodeOnJudge0({
    //         langId: language.id,
    //         codestring: code,
    //         stdin: "",
    //     },
    //         apiKey,
    //     ).then((res) => {
    //         console.log(res);
    //     }).catch((err) => {
    //         console.error(err);
    //     });
    // };

    const setParamLang = () => {
        if (lang === null || lang === undefined) return;
        const langs = languageOptions.filter((x) => x.value === lang);
        const language = langs.length === 0 ? {
            id: 0,
            name: lang,
            label: lang,
            value: lang,
        } : langs[0];
        onSelectChange(language);
    }

    useEffect(() => {
        let th = loadTheme();
        console.log("calling define theme from useEffect")
        handleThemeChange(th);
        setParamLang();

        window.addEventListener('message', (e) => {
            if (typeof e.data === 'string' || e.data instanceof String) {
                if (e.data.toString().includes('FLUTTER_WEB_CODESYNC::')) {
                    //Sync Code
                    const dat = e.data.toString().replaceAll('FLUTTER_WEB_CODESYNC::', '');
                    const [code, lang] = dat.split('::');
                    setCode(atob(code));
                    if (lang !== undefined) {
                        //Sync Language
                        const langs = languageOptions.filter((x) => x.value === lang);
                        const language = langs.length === 0 ? {
                            id: 0,
                            name: lang,
                            label: lang,
                            value: lang,
                        } : langs[0];
                        setLanguage(language)
                    }
                    console.log('FLUTTER_WEB_CODESYNC_COMPLETE');
                }
            }
        });
    }, []);

    const solo = (lang !== undefined && lang !== null)
    return (
        <>

            <div className="flex flex-row border-2 border-t-0 border-gray-600 gap-4" >
                <br />

                {!solo &&
                    <>
                        <div className="dropdownInner">
                            <LanguagesDropdown onSelectChange={onSelectChange} Userlanguage={language} key={lang} />
                        </div>
                        <div className="dropdownInner">
                            <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
                        </div>
                    </>
                }
                {
                    solo && <div className="dropdownInner">
                        <h1 className='text-white text-lg mt-1'>{language.value}</h1>
                    </div>
                }

                <div className="px-4 justify-end">
                    <div className="d-flex px-2 py-1 rounded-lg border focus:outline-none hover:bg-gray-700 hover:text-blue-700 focus:z-10  focus:ring-gray-500 bg-gray-900 border-gray-600 hover:text-white hover:bg-gray-700">
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

                </div>
            </div >

            < div className="editorlayout flex flex-row  space-x-4 items-start border-2 border-t-0 border-b-0 border-gray-600"
                style={{
                    height: `calc(100vh - 6.4vh)`,
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