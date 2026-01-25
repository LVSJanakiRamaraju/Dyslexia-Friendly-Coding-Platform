import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { AccessibilityContext } from "../context/AccessibilityContext";

export default function FlowchartView({ chart }) {
  const [svg, setSvg] = useState("");
  const initialized = useRef(false);
  const { theme } = useContext(AccessibilityContext);

const mermaidTheme =
  theme === "light" ? "default" : theme === "high-contrast" ? "dark" : "dark";

const flowchartThemeClasses = {
  dark: "bg-gray-800 text-white",
  light: "bg-gray-100 text-gray-900",
  "high-contrast": "bg-black text-yellow-300",
};


  useEffect(() => {
  if (!chart || !chart.startsWith("graph")) {
    setSvg("");
    return;
  }

  const render = async () => {
    try {
      const mermaid = (await import("mermaid")).default;

      if (!initialized.current) {
       mermaid.initialize({
  theme: mermaidTheme,
  startOnLoad: false,
  securityLevel: "loose",
});

        initialized.current = true;
      } else {
        mermaid.initialize({
  theme: mermaidTheme,
  startOnLoad: false,
  securityLevel: "loose",
});
      }

      const { svg } = await mermaid.render(
        "chart-" + Date.now(),
        chart
      );

      setSvg(svg);
    } catch (e) {
      console.error("Mermaid error:", e);
      setSvg("<p class='text-red-400'>Flowchart error</p>");
    }
  };

  render();
}, [chart, theme]);


  return (
    <div className={`w-full h-full p-4 overflow-auto ${flowchartThemeClasses[theme]} flex flex-col`}>
      <h3 className="font-bold mb-2 flex-shrink-0">Flowchart</h3>
      <div
        className="flex-1 overflow-auto"
        dangerouslySetInnerHTML={{
          __html: svg || "<p>No chart</p>",
        }}
      />
    </div>
  );
}
