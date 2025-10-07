import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addAnswer,
  finishInterview,
  nextQuestion,
  pauseTimer,
  resumeTimer,
  setTimer,
  tickTimer,
} from "../Store/Slices/sessionSlice";
import {
  addChatMessage,
  finalizeCandidate,
} from "../Store/Slices/candidatesSlice";
import { evaluateInterview } from "../utils/evaluator";

const InterviewFlow = () => {
  const dispatch = useDispatch();
  const {
    finished,
    questions,
    currentIndex,
    timer,
    candidateId,
    answers,
    isRunning,
  } = useSelector((state) => state.session);
  const [answer, setAnswer] = useState("");
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (currentQuestion && (timer === 0 || timer === null)) {
      dispatch(setTimer(currentQuestion?.time));
    }
  }, [currentQuestion, dispatch]);

  // useEffect(() => {
  //   if (!currentQuestion || timer <= 0) return;

  //   const interval = setInterval(() => {
  //     dispatch(tickTimer());
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [timer, dispatch, currentQuestion]);

  const handleFinish = async () => {
    const evaluation = await evaluateInterview(answers);
    console.log(evaluation);

    dispatch(
      finalizeCandidate({
        candidateId,
        score: evaluation.score,
        summary: evaluation.summary,
      })
    );
  };

  const handleSubmit = () => {
    dispatch(
      addAnswer({
        questionIndex: currentIndex,
        question: currentQuestion.prompt,
        answer,
      })
    );
    dispatch(
      addChatMessage({
        candidateId,
        message: { role: "candidate", text: answer },
      })
    );
    setAnswer("");

    dispatch(nextQuestion());

    const nextQ = questions[currentIndex + 1];
    if (nextQ) {
      dispatch(
        addChatMessage({
          candidateId,
          message: { role: "system", text: nextQ.prompt },
        })
      );
    }

    if (currentIndex + 1 >= questions.length) {
      dispatch(finishInterview());
      handleFinish();
    }
  };

  useEffect(() => {
    if (!isRunning || timer <= 0) return;

    const interval = setInterval(() => {
      dispatch(tickTimer());
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timer, dispatch, currentQuestion]);

  useEffect(() => {
    if (timer === 0 && currentQuestion) {
      handleSubmit();
    }
  }, [timer]);

  useEffect(() => {
    if (questions.length > 0 && currentIndex === 0 && answers.length === 0) {
      dispatch(
        addChatMessage({
          candidateId,
          message: { role: "system", text: questions[0].prompt },
        })
      );
    }
  }, [questions, currentIndex, answers, candidateId, dispatch]);

  if (finished)
    return (
      <p className="text-2xl font-semibold text-center mt-[14%]">
        Thank you, for attending the interview, we will get back to you soon.
      </p>
    );

  return (
    <div className="p-4 border rounded shadow-md max-w-xl mx-auto">
      <h3 className="text-lg font-bold mb-2">
        Question {currentIndex + 1} / {questions.length}
      </h3>
      <p className="mb-1">
        <strong>Difficulty:</strong> {currentQuestion?.difficulty}
      </p>
      <p className="mb-4">{currentQuestion?.prompt}</p>
      <p className="mb-4">
        <strong>Time Left:</strong> {timer}s
      </p>
      {isRunning ? (
        <button onClick={() => dispatch(pauseTimer())}>Pause</button>
      ) : (
        <button onClick={() => dispatch(resumeTimer())}>Resume</button>
      )}

      <textarea
        type="text"
        className="border p-2 w-full mb-2"
        value={answer}
        rows={5}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer..."
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default InterviewFlow;
