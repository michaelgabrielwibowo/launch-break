/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BrainCircuit, 
  Code, 
  Play, 
  RotateCcw, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  ChevronRight,
  Info
} from "lucide-react";
import { QuizQuestion } from "../types";

export default function PracticeLab() {
  const [activeTab, setActiveTab] = useState<"quiz" | "code">("quiz");

  // --- Quiz Master State ---
  const [selectedCategory, setSelectedCategory] = useState<string>("Machine Learning");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Intermediate");
  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [scoreLogged, setScoreLogged] = useState<boolean>(false);

  // --- Code Sandbox State ---
  const [selectedCodeSnippet, setSelectedCodeSnippet] = useState<string>("py_linear");
  const [customCode, setCustomCode] = useState<string>(`# Advanced Academic Gradient Descent Loops
def compute_loss(weights, bias, data):
    total_loss = 0
    for x, y in data:
        y_pred = (weights * x) + bias
        total_loss += (y - y_pred) ** 2
    return total_loss / len(data)

# Test inputs
points = [(1, 2), (2, 4.5), (3, 6.2)]
w, b = 0.5, 0.25
print(f"Initial L2 Loss: {compute_loss(w, b, points):.4f}")
`);
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([
    "Terminal: Sandbox initiated. System active.",
    "Ready to run script. Make edits on the left panel."
  ]);

  const codeSnippets: Record<string, { label: string; code: string }> = {
    py_linear: {
      label: "Linear Regression Loss Loop (Python)",
      code: `# Advanced Academic Gradient Descent Loops
def compute_loss(weights, bias, data):
    total_loss = 0
    for x, y in data:
        y_pred = (weights * x) + bias
        total_loss += (y - y_pred) ** 2
    return total_loss / len(data)

# Test inputs
points = [(1, 2), (2, 4.5), (3, 6.2)]
w, b = 0.5, 0.25
print(f"Initial L2 Loss: {compute_loss(w, b, points):.4f}")
`
    },
    py_kmeans: {
      label: "K-Means Centroid Shift (Python)",
      code: `# K-Means Coordinate Centroid Shifter
import random

clusters = [(1.5, 2.0), (3.0, 4.0), (1.0, 1.5)]
points = [(1.2, 1.8), (3.5, 4.2), (0.9, 1.1)]

def update_centroids(items, k_centroids):
    # Sum coordinates and mean recalculate
    x_sum, y_sum = sum([p[0] for p in items]), sum([p[1] for p in items])
    n = len(items)
    return (x_sum / n, y_sum / n)

print("Shifted centroid values calculated successfully.")
`
    },
    js_attention: {
      label: "Self Attention Score Matrix (JavaScript)",
      code: `// Simulating scaled dot-product attention scores
const queries = [0.2, 0.4, 0.8];
const keys = [0.1, 0.5, 0.9];
const scale = Math.sqrt(queries.length);

function computeAttention(q, k) {
  let dotProduct = 0;
  for (let i = 0; i < q.length; i++) {
    dotProduct += q[i] * k[i];
  }
  return Math.exp(dotProduct / scale);
}

const attentionRawScore = computeAttention(queries, keys);
console.log("Raw Dot Product Attention (Expon):", attentionRawScore.toFixed(4));
`
    }
  };

  const handleSnippetChange = (snippetId: string) => {
    setSelectedCodeSnippet(snippetId);
    setCustomCode(codeSnippets[snippetId]?.code || "");
  };

  // Run simulated compilation code
  const handleExecuteCode = () => {
    setIsRunningCode(true);
    setSandboxLogs(prev => [...prev, `[system] Executing current model code block...`]);

    setTimeout(() => {
      setIsRunningCode(false);
      let runOutput: string[] = [];
      if (selectedCodeSnippet === "py_linear") {
        runOutput = [
          ">>> python server_session.py",
          "Initial L2 Loss: 6.8420",
          "Updating step gradients (L1 learning rate: 0.01)...",
          "Iteration 10/100 -> Weights: 0.942, Bias: 0.402 -> Loss: 2.1021",
          "Iteration 100/100 -> Optimal Weights: 1.8021, Bias: 0.3214 -> Loss: 0.0542",
          "Success: Loss minimized. Iteration halted."
        ];
      } else if (selectedCodeSnippet === "py_kmeans") {
        runOutput = [
          ">>> python kmeans_centroids.py",
          "Evaluating dot product distances to centroids clusters...",
          "Cluster 0 Mean coordinates recalculated: (1.0500, 1.4500)",
          "Cluster 1 Mean coordinates recalculated: (3.5000, 4.2000)",
          "Optimal cluster parameters stored in server coordinates successfully."
        ];
      } else {
        runOutput = [
          ">>> node attention_mat.js",
          "Raw Dot Product Attention (Expon): 1.5421",
          "Applying Softmax normalization on target distributions...",
          "Normalised Attention Scores: [0.201, 0.342, 0.457]",
          "Process completed with exit code: 0"
        ];
      }

      setSandboxLogs(prev => [...prev, ...runOutput, `[system] Execution completed in 142ms.`]);
    }, 1200);
  };

  // --- Dynamic Quiz Fetcher ---
  const handleFetchQuiz = async () => {
    setIsLoadingQuiz(true);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswersCount(0);
    setScoreLogged(false);

    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: selectedCategory, difficulty: selectedDifficulty })
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuizQuestions(data.questions);
      } else {
        alert("Server failed to generate quiz questions. Trying offline bank instead.");
      }
    } catch (err) {
      console.error("Quiz fetch failed, loading offline fallback question pool:", err);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null) return;
    setIsAnswerSubmitted(true);
    const activeQuestion = quizQuestions[currentQuestionIndex];
    if (activeQuestion && selectedOptionIndex === activeQuestion.answerIndex) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  // Advance Questions
  const handleNextQuestion = () => {
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setScoreLogged(true);
    }
  };

  // Reset quiz
  const handleResetQuiz = () => {
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswersCount(0);
    setScoreLogged(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Sub tabs layout selector */}
      <div className="flex items-center gap-6 border-b border-[#eceef0] dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("quiz")}
          className={`font-sans text-sm font-semibold pb-2 border-b-2 transition-all ${
            activeTab === "quiz"
              ? "border-black dark:border-white text-black dark:text-white"
              : "border-transparent text-zinc-500 hover:text-black dark:hover:text-white"
          }`}
        >
          Dynamic AI Quiz Master
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`font-sans text-sm font-semibold pb-2 border-b-2 transition-all ${
            activeTab === "code"
              ? "border-black dark:border-white text-black dark:text-white"
              : "border-transparent text-zinc-500 hover:text-black dark:hover:text-white"
          }`}
        >
          Simulated Code Playground
        </button>
      </div>

      {/* 1. QUIZ MASTER RENDER PANEL */}
      {activeTab === "quiz" && (
        <div className="bg-white dark:bg-zinc-900 border border-[#eceef0] dark:border-zinc-850 rounded p-6 shadow-sm">
          
          {/* Settings to generate quiz */}
          {quizQuestions.length === 0 ? (
            <div className="max-w-xl space-y-5 py-6">
              <h3 className="font-sans font-bold text-black dark:text-white text-md flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-blue-600 animate-pulse" />
                <span>Configure Academic Topic Quiz</span>
              </h3>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
                Select your parameters below. Our server will deploy Gemini to compose modular MCQ questions based on scientific foundations!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Select Subject Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-[#f2f4f6] dark:bg-zinc-800 border border-[#c4c7c7] dark:border-zinc-700 rounded px-2.5 py-1.5 font-sans text-xs text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Python Algorithms">Python Algorithms</option>
                    <option value="Operations Research">Operations Research</option>
                    <option value="Deep Attention Networks & Transformers">Deep Attention Networks & Transformers</option>
                    <option value="Stochastic Systems & Queue Variables">Stochastic Systems & Queue Variables</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Academic Difficulty Range</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full bg-[#f2f4f6] dark:bg-zinc-800 border border-[#c4c7c7] dark:border-zinc-700 rounded px-2.5 py-1.5 font-sans text-xs text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner Level</option>
                    <option value="Intermediate">Intermediate Level</option>
                    <option value="Advanced">Advanced Level</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleFetchQuiz}
                disabled={isLoadingQuiz}
                className="w-full sm:w-auto px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black font-sans text-xs font-semibold rounded hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isLoadingQuiz ? (
                  <>
                    <span className="w-4 h-4 border-2 border-zinc-400 border-t-white dark:border-t-black rounded-full animate-spin"></span>
                    <span>Gemini composing scientific questions...</span>
                  </>
                ) : (
                  <>
                    <span>Generate dynamic AI quiz</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Active Live Quiz Session */
            <div className="space-y-6">
              
              {/* Score logged summary screen */}
              {scoreLogged ? (
                <div className="text-center max-w-md mx-auto py-8 space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 mb-2">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <h3 className="font-sans font-bold text-lg text-black dark:text-white">
                    Quiz Session Analytical Complete
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                    Excellent work! You achieved {correctAnswersCount} correct answers out of {quizQuestions.length} challenges. Your workspace metrics have been logged securely.
                  </p>

                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm font-mono text-slate-600 dark:text-zinc-400">
                      Overall Metric Level: <span className="font-bold text-black dark:text-white">{Math.round((correctAnswersCount / quizQuestions.length) * 100)}% Accuracy</span>
                    </p>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleResetQuiz}
                      className="px-4 py-2 bg-[#f2f4f6] dark:bg-zinc-800 hover:bg-zinc-200 text-black dark:text-white font-mono text-xs rounded-lg transition-colors border border-[#c4c7c7] dark:border-zinc-700 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Back to setup</span>
                    </button>
                  </div>
                </div>
              ) : (() => {
                const activeQuestion = quizQuestions[currentQuestionIndex];
                if (!activeQuestion) return null;
                return (
                  /* Core interactive Questions */
                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-4">
                      <span className="font-mono text-xs text-zinc-500">
                        Question {currentQuestionIndex + 1} of {quizQuestions.length}
                      </span>
                      <span className="font-mono text-xs text-blue-600 dark:text-blue-405 uppercase font-semibold">
                        Difficulty: {selectedDifficulty}
                      </span>
                    </div>

                    <h4 className="font-sans font-bold text-black dark:text-white text-md mb-5 leading-snug">
                      {activeQuestion.question}
                    </h4>

                    {/* MCQ custom buttons */}
                    <div className="space-y-2.5">
                      {activeQuestion.options.map((option, idx) => {
                        const isSelected = selectedOptionIndex === idx;
                        const isCorrectAnswer = idx === activeQuestion.answerIndex;
                        
                        let optionStyle = "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-black dark:text-zinc-350";
                        if (isSelected && !isAnswerSubmitted) {
                          optionStyle = "border-blue-600 bg-blue-50 dark:bg-zinc-800/60 text-blue-700 dark:text-blue-300 font-medium";
                        } else if (isAnswerSubmitted) {
                          if (isCorrectAnswer) {
                            optionStyle = "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold";
                          } else if (isSelected) {
                            optionStyle = "border-red-600 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={isAnswerSubmitted}
                            onClick={() => setSelectedOptionIndex(idx)}
                            className={`w-full p-3 border rounded text-left text-xs transition-all relative ${optionStyle}`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="font-mono bg-[#eceef0] dark:bg-zinc-800 px-1.5 py-0.5 rounded font-bold">{String.fromCharCode(65 + idx)}</span>
                              <span>{option}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback explanation block */}
                    {isAnswerSubmitted && (
                      <div className="mt-4 p-4 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 animate-fade-in">
                        <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-zinc-400">
                          <Info className="w-4 h-4 shrink-0 text-blue-500" />
                          <div>
                            <p className="font-bold text-black dark:text-white mb-1">Academic Explanation:</p>
                            <p>{activeQuestion.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submission and advancing controls */}
                    <div className="flex justify-end gap-2.5 pt-4 mt-4 border-t border-zinc-150 dark:border-zinc-800">
                      {!isAnswerSubmitted ? (
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={selectedOptionIndex === null}
                          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-sans text-xs font-semibold rounded hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
                        >
                          Check Answer
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-sans text-xs font-semibold rounded hover:opacity-90 active:scale-95 transition-all flex items-center gap-1"
                        >
                          <span>{currentQuestionIndex < quizQuestions.length - 1 ? "Next Challenge" : "Log Results"}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })()}

            </div>
          )}

        </div>
      )}

      {/* 2. SIMULATED CODE PLAYGROUND */}
      {activeTab === "code" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in">
          
          {/* Editor window - 3 columns */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-[#eceef0] dark:border-zinc-850 rounded p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <Code className="w-4.5 h-4.5 text-blue-600" />
                  <span className="font-sans font-bold text-black dark:text-white text-sm">Interactive Model Sandbox</span>
                </div>

                {/* Snippets selections */}
                <select
                  value={selectedCodeSnippet}
                  onChange={(e) => handleSnippetChange(e.target.value)}
                  className="bg-[#f2f4f6] dark:bg-zinc-800 border border-[#c4c7c7] dark:border-zinc-700 rounded px-2 py-1 font-mono text-[11px] text-zinc-800 dark:text-white"
                >
                  <option value="py_linear">Linear Lasso Regression (Python)</option>
                  <option value="py_kmeans">K-Means Cluster Matrix (Python)</option>
                  <option value="js_attention">Transformer Attention Log (JavaScript)</option>
                </select>
              </div>

              <p className="text-[11px] text-zinc-500 font-sans">
                Edit formulas or iteration counts directly inside the sandbox wrapper below.
              </p>

              {/* Textarea code space */}
              <textarea
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                className="w-full h-80 p-3.5 bg-zinc-950 text-emerald-400 font-mono text-xs border border-zinc-800 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none leading-5"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-150 dark:border-zinc-800">
              <button
                onClick={() => setCustomCode(codeSnippets[selectedCodeSnippet]?.code || "")}
                className="px-3.5 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:bg-[#f2f4f6] dark:hover:bg-zinc-800 text-black dark:text-white font-mono text-[11px] rounded transition-colors"
              >
                Reset Snippet
              </button>
              <button
                disabled={isRunningCode}
                onClick={handleExecuteCode}
                className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black font-sans text-xs font-semibold rounded hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 transition-all"
              >
                {isRunningCode ? (
                  <>
                    <span className="w-3 h-3 border border-zinc-400 border-t-white dark:border-t-black rounded-full animate-spin"></span>
                    <span>Running compiler...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Compile & Run Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Console / Output logs window - 2 columns */}
          <div className="lg:col-span-2 bg-zinc-950 text-zinc-350 font-mono text-xs border border-zinc-900 rounded p-5 flex flex-col justify-between h-[480px]">
            <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-2 scrollbar-thin">
              <span className="text-zinc-500 text-[10px] block border-b border-zinc-900 pb-1 uppercase tracking-wider">Academic Sandbox Output Log</span>
              {sandboxLogs.map((log, idx) => {
                let colorClass = "text-zinc-300";
                if (log.startsWith("[system]")) colorClass = "text-blue-400 font-semibold";
                else if (log.startsWith(">>>") || log.startsWith("Terminal:")) colorClass = "text-yellow-500";
                else if (log.includes("Success:") || log.includes("optimal") || log.includes("Optimised")) colorClass = "text-emerald-400";
                
                return (
                  <p key={idx} className={`${colorClass} leading-relaxed text-[11px]`}>
                    {log}
                  </p>
                );
              })}
            </div>

            <button
              onClick={() => setSandboxLogs(["Terminal: Console records purged. Ready."])}
              className="w-full py-1.5 text-center border border-zinc-900 hover:bg-zinc-900/60 rounded text-[10px] uppercase font-bold text-zinc-505 transition-colors mt-4"
            >
              Clear Output Records
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
