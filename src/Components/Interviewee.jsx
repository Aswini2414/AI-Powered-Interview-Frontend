import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ResumeUpload from "./ResumeUpload";
import InterviewFlow from "./InterviewFlow";

const Interviewee = () => {
  const { questions } = useSelector((state) => state.session);
  const [resumeParsed, setResumeParsed] = useState(false);

  useEffect(() => {
    if (questions.length === 6) {
      setResumeParsed(true);
    }
  }, [questions]);

  return (
    <div className="p-4 ">
      {!resumeParsed ? <ResumeUpload /> : <InterviewFlow />}
    </div>
  );
};

export default Interviewee;
