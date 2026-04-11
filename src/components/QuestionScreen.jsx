import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import OptionCard from "./OptionCard";
import ProgressBar from "./ProgressBar";

export default function QuestionScreen({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  tracker,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const trackerRef = useRef(tracker);

  // Keep ref in sync without triggering re-renders
  useEffect(() => {
    trackerRef.current = tracker;
  }, [tracker]);

  // Reset selection + start timing when question changes
  useEffect(() => {
    tracker.startQuestion(question.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const handleOptionSelect = useCallback(
    (option) => {
      setSelectedOption(option.id);
      trackerRef.current?.recordOptionHover?.(option.id);
      trackerRef.current?.recordAnswer?.(question.id, option.id);
    },
    [question.id]
  );

  const handleNext = useCallback(() => {
    const selected = question.options.find((o) => o.id === selectedOption);
    if (!selected) return;
    onAnswer({
      questionId: question.id,
      optionId: selectedOption,
      humanScore: selected.humanScore ?? 0,
    });
  }, [question, selectedOption, onAnswer]);

  const isLast = questionIndex + 1 === totalQuestions;

  return (
    <div style={{ width: "100%" }}>
      <ProgressBar current={questionIndex + 1} total={totalQuestions} />

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}>
          {/* Question Text */}
          <p
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 700,
              fontSize: "20px",
              color: "#0F0F0F",
              lineHeight: 1.45,
              marginTop: "24px",
              marginBottom: "24px",
              userSelect: "none",
            }}>
            {question.question}
          </p>

          {/* Options 2x2 Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}>
            {question.options.map((option) => (
              <OptionCard
                key={option.id}
                text={option.text}
                isSelected={selectedOption === option.id}
                onSelect={() => handleOptionSelect(option)}
              />
            ))}
          </div>

          {/* Next / See Results Button */}
          <AnimatePresence>
            {selectedOption && (
              <motion.button
                key="next-btn"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                onClick={handleNext}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4338CA";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#4F46E5";
                  e.currentTarget.style.transform = "translateY(0px)";
                }}
                style={{
                  width: "100%",
                  height: "52px",
                  borderRadius: "14px",
                  backgroundColor: "#4F46E5",
                  color: "#FFFFFF",
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: 600,
                  fontSize: "15px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "20px",
                  transition:
                    "background-color 200ms ease, transform 200ms ease",
                  userSelect: "none",
                }}>
                {isLast ? "See Results" : "Next"}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
