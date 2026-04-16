import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import FailScreen from "./components/FailScreen";
import PassScreen from "./components/PassScreen";
import QuestionScreen from "./components/QuestionScreen";
import ScoringScreen from "./components/ScoringScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import { InteractionTracker } from "./engine/InteractionTracker";
import { selectQuestions } from "./engine/QuestionEngine";
import { calculateScore } from "./engine/ScoringEngine";
import { generateSessionId } from "./utils/tokenGenerator";

const TOKEN_TTL_MS = 5 * 60 * 1000;

function getRuntimeConfig() {
  const config = window.__HUMORA_CONFIG__ || {};
  return {
    sitekey: config.sitekey || "",
    apiBaseUrl: config.apiBaseUrl || window.HUMORA_API_URL || "",
    parentOrigin: config.parentOrigin || document.referrer || "",
  };
}

export default function Widget() {
  const [currentState, setCurrentState] = useState("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState(() => selectQuestions());
  const [answers, setAnswers] = useState([]);
  const [scoreResult, setScoreResult] = useState(null);
  const [sessionId, setSessionId] = useState(() => generateSessionId());
  const [tracker, setTracker] = useState(() => new InteractionTracker());
  const [errorMessage, setErrorMessage] = useState("");
  const containerRef = useRef(null);
  const expireTimerRef = useRef(null);

  useEffect(() => {
    tracker.startTracking(containerRef);
    return () => {
      tracker.stopTracking();
      if (expireTimerRef.current) {
        window.clearTimeout(expireTimerRef.current);
      }
    };
  }, [tracker]);

  function handleBegin() {
    setErrorMessage("");
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

    const config = getRuntimeConfig();
    const assessmentPayload = {
      sitekey: config.sitekey,
      parentOrigin: config.parentOrigin,
      sessionId,
      answers,
      interactionSummary: tracker.getSummary(answers.map((answer) => answer.questionId)),
      clientTimestamp: Date.now(),
    };

    try {
      const baseUrl = config.apiBaseUrl || window.location.origin;
      const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/assess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentPayload),
      });
      const data = await response.json();

      if (!response.ok || !data.success || !data.token) {
        if (data.error === "human-verification-failed") {
          setScoreResult({
            ...result,
            totalScore: data.score ?? result.totalScore,
            verdict: "fail",
          });
          setErrorMessage("");
          window.__HUMORA_SEND_RESULT__?.({
            verified: false,
            error: data.error,
            score: data.score ?? result.totalScore,
            sessionId,
          });
          setCurrentState("fail");
          return;
        }
        throw new Error(data.error || "verification-failed");
      }

      const finalResult = {
        ...result,
        totalScore: data.score,
        verdict: data.verdict,
      };

      setScoreResult(finalResult);
      window.__HUMORA_SEND_RESULT__?.({
        verified: true,
        token: data.token,
        score: data.score,
        verdict: data.verdict,
        sessionId,
        timestamp: data.timestamp,
      });

      if (expireTimerRef.current) {
        window.clearTimeout(expireTimerRef.current);
      }
      expireTimerRef.current = window.setTimeout(() => {
        window.__HUMORA_SEND_RESULT__?.({ action: "expired" });
      }, TOKEN_TTL_MS);

      setCurrentState("pass");
    } catch (error) {
      console.error("Verification request failed:", error);
      setErrorMessage(
        "We could not complete verification right now. Please try again in a moment."
      );
      window.__HUMORA_SEND_RESULT__?.({
        verified: false,
        error: "verification-failed",
        score: result.totalScore,
        sessionId,
      });
      setCurrentState("fail");
    }
  }

  function handleRetry() {
    if (expireTimerRef.current) {
      window.clearTimeout(expireTimerRef.current);
      expireTimerRef.current = null;
    }
    setTracker(new InteractionTracker());
    setQuestions(selectQuestions());
    setSessionId(generateSessionId());
    setAnswers([]);
    setScoreResult(null);
    setErrorMessage("");
    setCurrentQuestionIndex(0);
    setCurrentState("welcome");
  }

  function handleContinue() {
    window.__HUMORA_SEND_RESULT__?.({ action: "continue" });
  }

  useEffect(() => {
    window.__HUMORA_RESET__ = handleRetry;
    return () => {
      delete window.__HUMORA_RESET__;
    };
  });

  return (
    <div
      ref={containerRef}
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
            <FailScreen key="fail" onRetry={handleRetry} errorMessage={errorMessage} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
