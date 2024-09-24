import { loader } from "@monaco-editor/react"; /* @vite-ignore */

const monacoThemes = {
    blackboard: "Blackboard",
    github: "GitHub",
    idle: "IDLE",
    monokai: "Monokai",
};

const defineTheme = (theme) => {
    return new Promise((res) => {/* @vite-ignore */
        Promise.all([
            loader.init(),
            import(`monaco-themes/themes/${monacoThemes[theme]}.json`),

        ]).then(([monaco, themeData]) => {

            monaco.editor.defineTheme(theme, themeData);
            res();
        });
    });
};

export { defineTheme, monacoThemes };