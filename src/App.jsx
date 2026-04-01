import React, { useState, useEffect, useMemo, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import {
  Search,
  Plus,
  Trash2,
  Moon,
  Sun,
  Database,
  User,
  Loader2,
  BookOpen,
  Sparkles,
  Trophy,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Code2,
  Play,
  RotateCcw,
  Terminal,
  Edit3,
} from "lucide-react";

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = firebaseConfig.projectId;

const initialData = [];


export default function App() {
  const [user, setUser] = useState(null);
  const [dbQuestions, setDbQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(new Set());
  const [viewMode, setViewMode] = useState("quiz"); // 'quiz', 'list', 'code'
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Code Editor State
  const [userCode, setUserCode] = useState("");
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Gemini State
  const [geminiResult, setGeminiResult] = useState(null);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);

  // Add/Edit Question State
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    category: "JS",
    question: "",
    answer: "",
    isPractical: false,
    starterCode: "",
  });
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [editingQuestionItem, setEditingQuestionItem] = useState(null);
  const [builtInQuestions, setBuiltInQuestions] = useState([]);

  // Firebase Init
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== "undefined" &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.warn("Firebase auth failed (continuing without auth):", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  // Load Questions from Firebase (auth optional)
  useEffect(() => {
    // Load user-added questions
    const userQuestionsRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "questions",
    );
    const unsubscribeUserQuestions = onSnapshot(
      userQuestionsRef,
      (snapshot) => {
        const userQuestions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isUserAdded: true,
        }));
        setDbQuestions(userQuestions);
      },
    );

    // Load built-in questions
    const builtInRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "builtIn",
    );
    const unsubscribeBuiltIn = onSnapshot(builtInRef, (snapshot) => {
      const builtInQs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isBuiltIn: true,
      }));
      setBuiltInQuestions(builtInQs);
    });

    return () => {
      unsubscribeUserQuestions();
      unsubscribeBuiltIn();
    };
  }, [user]);

  const allData = useMemo(
    () => [...builtInQuestions, ...dbQuestions],
    [builtInQuestions, dbQuestions],
  );
  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      const qText = (item.q || item.text || "").toLowerCase();
      const matchesSearch = qText.includes(search.toLowerCase());
      const matchesFilter = filter === "All" || item.cat === filter;
      return matchesSearch && matchesFilter;
    });
  }, [allData, search, filter]);

  const currentItem = filteredData[currentIndex] || null;

  // Reset code when item changes
  useEffect(() => {
    if (currentItem?.practical) {
      setUserCode(currentItem.starter || "// Start coding here...");
    } else {
      setUserCode("// Select a practical question to start coding.");
    }
    setConsoleOutput([]);
    setGeminiResult(null);
    setShowAnswer(false);
  }, [currentIndex, currentItem]);

  // Code Execution Logic
  const runCode = () => {
    setIsExecuting(true);
    const logs = [];
    const customConsole = {
      log: (...args) =>
        logs.push(
          args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" "),
        ),
      error: (...args) => logs.push(`Error: ${args.join(" ")}`),
      warn: (...args) => logs.push(`Warning: ${args.join(" ")}`),
    };

    try {
      // Create a function from the code string
      const func = new Function("console", userCode);
      func(customConsole);
    } catch (err) {
      logs.push(`Runtime Error: ${err.message}`);
    }

    setConsoleOutput(logs);
    setIsExecuting(false);
  };

  const handleAIHelp = async () => {
    if (!currentItem) return;
    setIsGeminiLoading(true);
    setGeminiResult(null);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Provide a solution code for: ${currentItem.q || currentItem.text}`,
                  },
                ],
              },
            ],
            systemInstruction: {
              parts: [
                {
                  text: "Provide ONLY a clean JavaScript code snippet with comments. No intro text.",
                },
              ],
            },
          }),
        },
      );
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setGeminiResult(text);
    } catch (e) {
      setGeminiResult("// AI Error: Failed to fetch solution.");
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const resetQuestionForm = () => {
    setNewQuestion({
      category: "JS",
      question: "",
      answer: "",
      isPractical: false,
      starterCode: "",
    });
    setEditQuestionId(null);
    setEditingQuestionItem(null);
  };

  const handleStartEdit = (item) => {
    setEditQuestionId(item.id);
    setEditingQuestionItem(item);
    setNewQuestion({
      category: item.cat || "JS",
      question: item.q || item.text || "",
      answer: item.a || item.answer || "",
      isPractical: !!item.practical,
      starterCode: item.starter || "",
    });
    setShowAddQuestion(true);
  };

  const handleDeleteQuestion = async (item) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      const collectionName = item.isBuiltIn ? "builtIn" : "questions";
      await deleteDoc(
        doc(db, "artifacts", appId, "public", "data", collectionName, item.id),
      );
      alert("Question deleted.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete question: " + error.message);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.question.trim() || !newQuestion.answer.trim()) {
      alert("Please fill in question and answer fields!");
      return;
    }

    setIsAddingQuestion(true);
    try {
      const questionData = {
        q: newQuestion.question,
        a: newQuestion.answer,
        cat: newQuestion.category,
        practical: newQuestion.isPractical,
      };

      if (newQuestion.isPractical && newQuestion.starterCode.trim()) {
        questionData.starter = newQuestion.starterCode;
      } else {
        questionData.starter = "";
      }

      if (editQuestionId) {
        const collectionName = editingQuestionItem?.isBuiltIn
          ? "builtIn"
          : "questions";
        await updateDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            collectionName,
            editQuestionId,
          ),
          questionData,
        );
        alert("Question updated successfully!");
      } else {
        await addDoc(
          collection(db, "artifacts", appId, "public", "data", "questions"),
          questionData,
        );
        alert("Question added successfully!");
      }

      resetQuestionForm();
      setShowAddQuestion(false);
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save question: " + error.message);
    } finally {
      setIsAddingQuestion(false);
    }
  };

  return (
    <div
      className={`${isDarkMode ? "dark bg-slate-900 text-white" : "bg-slate-50 text-slate-900"} min-h-screen transition-all duration-300 flex flex-col`}
    >
      {/* Nav */}
      <nav className="p-4 border-b border-slate-700/50 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Code2 className="text-blue-500" />
          <h1 className="font-black italic uppercase text-lg">
            InterviewMaster{" "}
            <span className="text-blue-500 font-bold border border-blue-500 px-1 text-[10px] rounded">
              PRO
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-1">
            {["quiz", "list", "code"].map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${viewMode === m ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "hover:bg-slate-700"}`}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddQuestion(true)}
            className="p-2 rounded-full hover:bg-blue-600/20 text-blue-400"
            title="Add Question"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-slate-700/30"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col max-w-7xl mx-auto w-full p-4 gap-6">
        {/* Unified Sidebar for Quiz/Code Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Left Column: Question/List */}
          <div
            className={`${viewMode === "code" ? "lg:col-span-4" : "lg:col-span-12"} flex flex-col gap-4`}
          >
            {/* Search/Filter Bar (Only visible in quiz/list) */}
            {viewMode !== "code" && (
              <div className="flex flex-col md:flex-row gap-2 mb-2">
                <div className="relative flex-grow">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search topics..."
                    className={`w-full pl-10 pr-4 py-3 rounded-xl outline-none border transition-all ${isDarkMode ? "bg-slate-800 border-slate-700 focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"}`}
                  />
                </div>
                <div className="flex gap-1">
                  {["All", "JS", "Node", "DB"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold ${filter === f ? "bg-blue-600 text-white" : "bg-slate-800"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="text-xs opacity-60 ml-auto">
                  {builtInQuestions.length === 0 ? (
                    <span className="text-amber-400 font-bold">
                      ⚠️ Click DB icon to sync questions
                    </span>
                  ) : (
                    <span>
                      📊 {builtInQuestions.length} built-in +{" "}
                      {dbQuestions.length} custom = {allData.length} total
                    </span>
                  )}
                </div>
              </div>
            )}

            {viewMode === "quiz" ? (
              <div
                className={`p-8 rounded-3xl border shadow-xl flex flex-col items-center text-center min-h-[400px] ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}
              >
                <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase mb-4">
                  {currentItem?.cat}
                </span>
                <h2 className="text-3xl font-bold mb-8 leading-tight">
                  {currentItem?.q || currentItem?.text || "No Data"}
                </h2>
                <div className="flex-grow flex flex-col justify-center w-full">
                  {showAnswer ? (
                    <div className="p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-left mb-6">
                      <p className="italic text-lg opacity-90">
                        {currentItem?.a || currentItem?.answer}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="px-10 py-4 bg-blue-600 rounded-2xl font-black text-white hover:scale-105 transition-all mb-6"
                    >
                      REVEAL ANSWER
                    </button>
                  )}
                  {currentItem?.practical && (
                    <button
                      onClick={() => setViewMode("code")}
                      className="flex items-center justify-center gap-2 text-sm font-bold text-green-500 hover:bg-green-500/10 p-3 rounded-xl border border-green-500/20"
                    >
                      <Code2 size={16} /> PRACTICE WITH CODE
                    </button>
                  )}
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() =>
                      setCurrentIndex(Math.max(0, currentIndex - 1))
                    }
                    className="p-3 bg-slate-700 rounded-full hover:bg-blue-600"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentIndex(
                        Math.min(filteredData.length - 1, currentIndex + 1),
                      )
                    }
                    className="p-3 bg-slate-700 rounded-full hover:bg-blue-600"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            ) : viewMode === "list" ? (
              <div className="grid gap-3">
                {filteredData.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setViewMode("quiz");
                    }}
                    className={`p-4 rounded-xl border cursor-pointer hover:border-blue-500 transition-all ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold">{item.q || item.text}</h4>
                      <div className="flex items-center gap-2">
                        {item.practical && (
                          <Code2 size={14} className="text-green-500" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(item);
                          }}
                          className="p-1 rounded hover:bg-blue-500/20"
                          title="Edit question"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuestion(item);
                          }}
                          className="p-1 rounded hover:bg-red-500/20"
                          title="Delete question"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Code Sidebar (Question Details)
              <div
                className={`p-6 rounded-2xl border h-full ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}
              >
                <button
                  onClick={() => setViewMode("quiz")}
                  className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-1 mb-4"
                >
                  <ChevronLeft size={14} /> BACK TO QUIZ
                </button>
                <h3 className="text-xl font-bold mb-2">Practical Challenge</h3>
                <p className="text-sm opacity-70 mb-6">
                  {currentItem?.q || currentItem?.text}
                </p>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 mb-4">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase mb-2 flex items-center gap-1">
                    <Sparkles size={10} /> AI Strategy
                  </h4>
                  <p className="text-xs opacity-80 leading-relaxed italic">
                    {currentItem?.a || currentItem?.answer}
                  </p>
                </div>
                <button
                  onClick={handleAIHelp}
                  disabled={isGeminiLoading}
                  className="w-full py-2 bg-slate-700 rounded-lg text-xs font-bold hover:bg-slate-600 flex items-center justify-center gap-2"
                >
                  {isGeminiLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} className="text-blue-400" />
                  )}
                  GET SOLUTION
                </button>
                {geminiResult && (
                  <div className="mt-4 p-3 bg-slate-950 border border-blue-500/30 rounded-lg">
                    <pre className="text-[10px] font-mono whitespace-pre-wrap text-blue-300">
                      {geminiResult}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Code Editor (Only in code mode) */}
          {viewMode === "code" && (
            <div className="lg:col-span-8 flex flex-col gap-4 h-[70vh] lg:h-auto">
              {/* Editor Header */}
              <div className="bg-slate-800 border border-slate-700 rounded-t-2xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    solution.js
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setUserCode(currentItem?.starter || "");
                      setConsoleOutput([]);
                    }}
                    className="p-1.5 hover:bg-slate-700 rounded text-slate-400"
                    title="Reset Code"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    onClick={runCode}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-black flex items-center gap-2 shadow-lg shadow-green-900/20"
                  >
                    <Play size={12} fill="white" /> RUN CODE
                  </button>
                </div>
              </div>

              {/* Editor Surface */}
              <div className="flex-grow relative">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full h-full bg-slate-950 p-6 font-mono text-sm border-x border-slate-700 focus:outline-none resize-none text-blue-50"
                  spellCheck="false"
                />
              </div>

              {/* Console Output */}
              <div className="h-40 bg-slate-900 border border-slate-700 rounded-b-2xl p-4 overflow-y-auto">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2">
                  <Terminal size={12} /> Console Output
                </div>
                <div className="font-mono text-xs space-y-1">
                  {consoleOutput.length === 0 ? (
                    <span className="opacity-30 italic">
                      No output. Press Run...
                    </span>
                  ) : (
                    consoleOutput.map((log, i) => (
                      <div
                        key={i}
                        className={
                          log.startsWith("Error") || log.startsWith("Runtime")
                            ? "text-red-400"
                            : "text-green-400"
                        }
                      >
                        <span className="opacity-30 mr-2">{">"}</span>
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Question Modal */}
      {showAddQuestion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-700/50 sticky top-0 bg-slate-900">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {editQuestionId ? (
                  <>
                    <Edit3 className="text-blue-400" /> Edit Question
                  </>
                ) : (
                  <>
                    <Plus className="text-blue-400" /> Add New Question
                  </>
                )}
              </h2>
              <button
                onClick={() => {
                  setShowAddQuestion(false);
                  resetQuestionForm();
                }}
                className="p-1 hover:bg-slate-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleAddQuestion} className="p-6 space-y-4">
              {/* Category Select */}
              <div>
                <label className="block text-sm font-bold mb-2">Category</label>
                <select
                  value={newQuestion.category}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, category: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500"
                >
                  <option value="JS">JavaScript</option>
                  <option value="Node">Node.js</option>
                  <option value="DB">Database</option>
                  <option value="React">React</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Question Input */}
              <div>
                <label className="block text-sm font-bold mb-2">Question</label>
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      question: e.target.value,
                    })
                  }
                  placeholder="Enter your question..."
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Answer/Description Input */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Answer / Description
                </label>
                <textarea
                  value={newQuestion.answer}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, answer: e.target.value })
                  }
                  placeholder="Enter answer or description..."
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Practical Question Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPractical"
                  checked={newQuestion.isPractical}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      isPractical: e.target.checked,
                    })
                  }
                  className="w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="isPractical"
                  className="cursor-pointer font-bold"
                >
                  Make this a Practical Code Challenge
                </label>
              </div>

              {/* Starter Code (only if practical) */}
              {newQuestion.isPractical && (
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Starter Code Template
                  </label>
                  <textarea
                    value={newQuestion.starterCode}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        starterCode: e.target.value,
                      })
                    }
                    placeholder="// Enter starter code template here..."
                    rows="6"
                    className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 focus:outline-none focus:border-blue-500 resize-none font-mono text-sm"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isAddingQuestion}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  {isAddingQuestion ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : editQuestionId ? (
                    <>
                      <Edit3 size={16} /> Update Question
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Add Question
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddQuestion(false);
                    resetQuestionForm();
                  }}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Mode Switcher */}
      <div className="fixed bottom-0 w-full md:hidden bg-slate-800 border-t border-slate-700 p-2 flex gap-1">
        {["quiz", "list", "code"].map((m) => (
          <button
            key={m}
            onClick={() => setViewMode(m)}
            className={`flex-1 py-3 text-[10px] font-black uppercase rounded-lg ${viewMode === m ? "bg-blue-600" : "bg-slate-700"}`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
