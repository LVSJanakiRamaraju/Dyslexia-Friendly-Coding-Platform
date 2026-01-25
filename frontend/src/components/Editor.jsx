import { useContext, useState, useRef, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";

import { AccessibilityContext } from "../context/AccessibilityContext.jsx";
import useTTS from "../hooks/useTTS.js";
import useSTT from "../hooks/useSTT.js";


import { Play, Mic, Volume2 } from "lucide-react";

export default function Editor({
  code,
  setCode,
  language,
  setLanguage,
  onRun
}) {
  const { fontFamily, fontSize, lineHeight, theme } =
  useContext(AccessibilityContext);

const monacoTheme = {
  dark: "vs-dark",
  light: "light",
  "high-contrast": "hc-black",
};

const editorThemeClasses = {
  dark: "bg-gray-800 border-gray-700",
  light: "bg-gray-100 border-gray-300",
  "high-contrast": "bg-black border-yellow-500",
};

const editorHeaderThemeClasses = {
  dark: "bg-gray-800 border-gray-700 text-white",
  light: "bg-gray-200 border-gray-300 text-gray-900",
  "high-contrast": "bg-black border-yellow-500 text-yellow-300",
};

const editorSelectThemeClasses = {
  dark: "bg-gray-700 text-white",
  light: "bg-gray-300 text-gray-900",
  "high-contrast": "bg-yellow-500 text-black",
};

const editorButtonThemeClasses = {
  dark: "bg-gray-700 text-white hover:bg-gray-600",
  light: "bg-gray-300 text-gray-900 hover:bg-gray-400",
  "high-contrast": "bg-yellow-500 text-black hover:bg-yellow-600",
};

  const { speak } = useTTS();
  const { startListening, isListening } = useSTT((text) => {
    setCode((prev) => prev + "\n" + text);
    speak("Code added");
  });

  return (
    <div className={`relative flex flex-col h-full w-full ${editorThemeClasses[theme]}`}>
      <div className={`flex items-center gap-3 p-3 border-b ${editorHeaderThemeClasses[theme]}`}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`px-3 py-2 rounded ${editorSelectThemeClasses[theme]}`}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>

        <button
          onClick={onRun}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            theme === 'light' ? 'bg-green-500 text-gray-900 hover:bg-green-600' :
            theme === 'high-contrast' ? 'bg-yellow-500 text-black hover:bg-yellow-600' :
            'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <Play size={16} /> Run
        </button>

        <button
          onClick={startListening}
          disabled={isListening}
          className={`px-3 py-2 rounded ${editorButtonThemeClasses[theme]}`}
        >
          <Mic size={16} />
        </button>

        <button
          onClick={() => speak(code)}
          className={`px-3 py-2 rounded ${editorButtonThemeClasses[theme]}`}
        >
          <Volume2 size={16} />
        </button>
      </div>

      <MonacoEditor
        height="100%"
        language={language}
        value={code}
        onChange={(v) => setCode(v || "")}
        theme={monacoTheme[theme]}
        options={{
          fontFamily,
          fontSize,
          lineHeight,
          fontLigatures: true,
          wordWrap: "on",
          minimap: { enabled: false }
        }}
      />
    </div>
  );
}
