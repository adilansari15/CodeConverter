import {useState, useEffect} from "react";
import{
  Code, Play, RotateCcw, Clipboard, Loader2
} from "lucide-react"
import codeMirror from "@uiw/react-codemirror";
import {javascript} from "@codemirror/lang-javascript";
import {dracula} from "@uiw/codemirror-theme-dracula";


function App() {
  const [aiReady, setAiReady] = useState(false);
  const [inputCode, setInputCode] = useState(
    'functio helloWorld() {\n console.log("Hello, world!);\n}'
  );
  const [outputCode, setOutputCode] = useState("");
  const [targetLag, setTargetLag] = useState("Python");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  useEffect(()=> {
    const checkReady = setInterval (() => {
      if(window.puter?.ai?.chat){
        setAiReady(true)
        clearInterval(checkReady)
      }
    }, 300)
    return() => clearInterval(checkReady)
  }, []);


  const handleConvert = async () => {
    if(!inputCode.trim()) {
      setFeedback("❌ Please enter some code to convert. ");
      return;
    }

    if(!aiReady){
      setFeedback("❌ AI not ready, please wait for a few second. ");
      return;
    }

    setLoading(true) ;
    setFeedback( "" ) ;
    setOutputCode( "" ) ;

    try {
      const res = await window.puter.ai.chat(
        `
        Convert the following code into 
        ${targetLag}. Only return the converted code, no explanationas.
        Code:
        ${inputCode}
        `
      );

      const reply =
        typeof res === "string" 
        ? res
        : res?.message?.content ||
        res?.message?.map((m) => m.content).join("\n") || "";

      if (!reply.trim()) throw new Error("Empty Response From Ai");

      setOutputCode(reply.trim());
      setFeedback("✅ Conversion Successfull!");
    } catch(err) {
      console.error("Conversion error:", err);
      setFeedback(`❌ Error: ${err.message}`);
    }

  };

  const handeReset = () => {
    setInputCode( 'functio helloWorld() {\n console.log("Hello, world!);\n}');
    setOutputCode("");
    setFeedback("");

  };
  
  const handleCopy = async () => {
    if(outputCode){
      await navigator.clipboard.writeText
      (outputCode);
      setFeedback ("📋 Code copied to clipboard")
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 flex flex-col items-center justify-center p-6 gap-10 relative overflow-hidden">
      <h1 className="text-5xl sm:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent text-center drop-shadow-lg relative">
        AI Code Converter
      </h1>
    </div>
  );
}

export default App;