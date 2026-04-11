import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    tracker.startQuestion(question.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  function handleOptionSelect(option) {
    setSelectedOption(option.id);
    tracker.recordOptionHover(option.id);
    tracker.recordAnswer(question.id, option.id);
  }

  function handleNext() {
    const selected = question.options.find((o) => o.id === selectedOption);
    onAnswer({
      questionId: question.id,
      optionId: selectedOption,
      humanScore: selected?.humanScore ?? 0,
    });
  }

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
          <p
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 700,
              fontSize: "20px",
              color: "#0F0F0F",
              lineHeight: 1.45,
              marginTop: "20px",
              marginBottom: "24px",
            }}>
            {question.question}
          </p>

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

          <AnimatePresence>
            {selectedOption && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                onClick={handleNext}
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
