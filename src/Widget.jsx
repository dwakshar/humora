import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import FailScreen from "./components/FailScreen";
import PassScreen from "./components/PassScreen";
import QuestionScreen from "./components/QuestionScreen";
import ScoringScreen from "./components/ScoringScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import { InteractionTracker } from "./engine/InteractionTracker";
import { selectQuestions } from "./engine/QuestionEngine";
import { calculateScore } from "./engine/ScoringEngine";
import { generateSessionId, generateToken } from "./utils/tokenGenerator";

export default function Widget() {
  const [currentState, setCurrentState] = useState("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState(() => selectQuestions());
  const [answers, setAnswers] = useState([]);
  const [scoreResult, setScoreResult] = useState(null);
  const [sessionId, setSessionId] = useState(() => generateSessionId());
  const [tracker, setTracker] = useState(() => new InteractionTracker());

  function handleBegin() {
    setCurrentState("question");
    setCurrentQuestionIndex(0);
  }

  function handleAnswer(answerData) {
    const updatedAnswers = [...answers, answerData];
    setAnswers(updatedAnswers);
    if (currentQuestionIndex < 4) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      setCurrentState("scoring");
    }
  }

  async function handleScoringComplete() {
    const result = calculateScore(answers, tracker);
    setScoreResult(result);

    let finalVerdict = result.verdict;
    if (result.verdict === "borderline") {
      finalVerdict = result.totalScore >= 40 ? "pass" : "fail";
    }

    const verified = finalVerdict !== "fail";

    if (verified) {
      try {
        await generateToken({
          score: result.totalScore,
          verdict: finalVerdict,
          sessionId,
          timestamp: Date.now(),
        });
      } catch (e) {
        console.error("Token generation failed:", e);
      }
    }

    window.parent.postMessage(
      {
        source: "humora",
        verified,
        score: result.totalScore,
        sessionId,
      },
      "*"
    );

    setCurrentState(verified ? "pass" : "fail");
  }

  function handleRetry() {
    setTracker(new InteractionTracker());
    setQuestions(selectQuestions());
    setSessionId(generateSessionId());
    setAnswers([]);
    setScoreResult(null);
    setCurrentQuestionIndex(0);
    setCurrentState("welcome");
  }

  function handleContinue() {
    window.parent.postMessage({ source: "humora", action: "continue" }, "*");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
        padding: "24px",
      }}>
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        }}>
        <AnimatePresence mode="wait">
          {currentState === "welcome" && (
            <WelcomeScreen key="welcome" onBegin={handleBegin} />
          )}
          {currentState === "question" && (
            <QuestionScreen
              key={`question-${currentQuestionIndex}`}
              question={questions[currentQuestionIndex]}
              questionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              tracker={tracker}
            />
          )}
          {currentState === "scoring" && (
            <ScoringScreen key="scoring" onComplete={handleScoringComplete} />
          )}
          {currentState === "pass" && (
            <PassScreen
              key="pass"
              personalityLine={scoreResult?.personalityLine ?? ""}
              onContinue={handleContinue}
            />
          )}
          {currentState === "fail" && (
            <FailScreen key="fail" onRetry={handleRetry} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
