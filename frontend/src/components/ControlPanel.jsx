import { useContext, useState, useRef, useEffect } from "react";
import { AccessibilityContext } from "../context/AccessibilityContext.jsx";
import {
  Settings,
  Moon,
  Sun,
  Type,
  Volume2,
  Contrast,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  GripVertical,
} from "lucide-react";

export default function ControlPanel() {
  const {
    fontFamily, setFontFamily,
    fontSize, setFontSize,
    lineHeight, setLineHeight,
    ttsRate, setTtsRate,
    theme, setTheme,
  } = useContext(AccessibilityContext);

  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidth] = useState(320); // Default 320px (w-80)
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef(null);

  const panelTheme = {
    dark: "bg-transparent-900 text-inherit border-current",
    light: "bg-gray-200 text-gray-900 border-gray-300",
    "high-contrast": "bg-black text-yellow-300 border-yellow-500",
  };

  const themes = [
    { id: "dark", name: "Dark Theme", icon: <Moon size={18} /> },
    { id: "light", name: "Light Theme", icon: <Sun size={18} /> },
    { id: "high-contrast", name: "High Contrast", icon: <Contrast size={18} /> },
  ];

  const fonts = [
    { value: "'OpenDyslexic', Arial, sans-serif", label: "OpenDyslexic" },
    { value: "monospace", label: "Monospace" },
    { value: "'Courier New', monospace", label: "Courier New" },
    { value: "'Consolas', monospace", label: "Consolas" },
    { value: "'Source Code Pro', monospace", label: "Source Code Pro" },
    { value: "'Fira Code', monospace", label: "Fira Code" },
  ];

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !panelRef.current) return;
      
      // Get the position relative to the viewport
      const newWidth = e.clientX;
      
      // Constrain width between 200px and 600px
      if (newWidth > 200 && newWidth < 600) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'auto';
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = 'auto';
      };
    }
  }, [isResizing]);

  return (
    <>
      {/* Toggle Button - Shows when panel is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed left-0 top-4 z-50 p-3 rounded-r-lg ${
            theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' :
            theme === 'light' ? 'bg-gray-200 text-gray-900 hover:bg-gray-300' :
            'bg-black text-yellow-300 hover:bg-gray-900'
          } border-r border-t border-b transition-all`}
          aria-label="Open accessibility panel"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Sidebar Panel */}
      <div 
        ref={panelRef}
        className={`${isOpen ? '' : 'w-0'} transition-all duration-300 overflow-hidden relative p-6 border-r overflow-y-auto ${panelTheme[theme]}`}
        style={{ width: isOpen ? `${width}px` : '0px' }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className={`absolute top-4 right-4 p-2 rounded-lg ${
            theme === 'dark' ? 'hover:bg-gray-700' :
            theme === 'light' ? 'hover:bg-gray-300' :
            'hover:bg-gray-900'
          } transition-colors z-10`}
          aria-label="Close accessibility panel"
        >
          <X size={20} />
        </button>

        {/* Resize Handle with Icon */}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
          className={`absolute top-1/2 -right-4 transform -translate-y-1/2 z-50 p-2 rounded-full cursor-col-resize transition-all ${
            isResizing 
              ? (theme === 'dark' ? 'bg-blue-500 scale-125' :
                 theme === 'light' ? 'bg-blue-500 scale-125' :
                 'bg-yellow-300 scale-125')
              : (theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white hover:scale-110 shadow-lg' :
                 theme === 'light' ? 'bg-gray-300 text-gray-700 hover:bg-blue-400 hover:text-white hover:scale-110 shadow-lg' :
                 'bg-yellow-400 text-black hover:bg-yellow-300 hover:scale-110 shadow-lg')
          } select-none`}
          style={{ cursor: isResizing ? 'col-resize' : 'grab' }}
          aria-label="Drag to resize panel"
          title="Drag to resize panel width"
        >
          <GripVertical size={20} />
        </div>

        {/* Header */}
      <div className="mb-8 pb-6 border-b border-current">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-current/10">
              <Settings size={22} />
            </div>
            <h2 className="text-xl font-bold">Accessibility</h2>
          </div>
        </div>
        <p className="text-sm opacity-70 pl-2">
          Customize your coding experience
        </p>
      </div>

      {/* Theme Selector */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-4 pl-2">Theme</h3>
        <div className="space-y-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`w-full p-4 rounded-xl border flex items-center justify-between transition ${
                theme === t.id
                  ? "border-current bg-current/10"
                  : "border-current/40 hover:bg-current/5"
              }`}
            >
              <div className="flex items-center gap-3">
                {t.icon}
                <span className="font-medium">{t.name}</span>
              </div>
              {theme === t.id && <Check size={18} />}
            </button>
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-3 pl-2">Font Family</h3>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full p-4 rounded-xl border border-current/40 bg-transparent"
          style={{ fontFamily }}
        >
          {fonts.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-4 pl-2">Font Size</h3>
        <input
          type="range"
          min="12"
          max="24"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-sm mt-2">{fontSize}px</div>
      </div>

      {/* Line Height */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-4 pl-2">Line Spacing</h3>
        <input
          type="range"
          min="18"
          max="40"
          value={lineHeight}
          onChange={(e) => setLineHeight(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-sm mt-2">{lineHeight}px</div>
      </div>

      {/* TTS Rate */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-4 pl-2">TTS Speed</h3>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={ttsRate}
          onChange={(e) => setTtsRate(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-sm mt-2">{ttsRate.toFixed(1)}x</div>
      </div>

      {/* Preview */}
      <div className="mt-10 p-4 rounded-xl border border-current/40">
        <p className="text-sm mb-3 opacity-70">Live Preview</p>
        <div
          className="p-3 border rounded"
          style={{
            fontFamily,
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeight}px`,
          }}
        >
          <code>def hello():</code>
          <br />
          <code className="ml-4">print("Hi!")</code>
        </div>
      </div>
      </div>
    </>
  );
}
