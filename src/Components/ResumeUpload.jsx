import React, { useState } from "react";
import {
  Upload,
  Button,
  Input,
  Typography,
  Card,
  Space,
  message,
  Spin,
} from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { parseResume } from "../utils/resumeParser";
import { addCandidate } from "../Store/Slices/candidatesSlice";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { startInterviewWithSkills } from "../Store/Slices/sessionSlice";

const { Title, Text } = Typography;

const ResumeUpload = () => {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({ name: "", email: "", phone: "" });
  const [step, setStep] = useState("upload");
  const dispatch = useDispatch();

  const handleUpload = async (file) => {
    setLoading(true);
    try {
      let parsed = await parseResume(file);

      const id = uuidv4();
      parsed = { id, ...parsed };


      if (parsed.name && parsed.email && parsed.phone) {
        dispatch(addCandidate(parsed));
        dispatch(
          startInterviewWithSkills({
            candidateId: parsed.id,
            skills: parsed.skills,
          })
        );
        setStep("generating");
      } else {
        setFields({
          name: parsed.name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          skills: parsed.skills,
        });
        setStep("fillFields");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to parse resume. Please enter details manually.");
      setStep("upload");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldSubmit = () => {
    if (!fields.name || !fields.email || !fields.phone) {
      return message.warning("Please fill in all fields.");
    }

    const id = uuidv4();
    const candidate = { id, ...fields };

    dispatch(addCandidate(candidate));
    dispatch(
      startInterviewWithSkills({
        candidateId: candidate.id,
        skills: candidate.skills,
      })
    );
    setStep("generating");
  };

  return (
    <div
      className="flex items-center justify-center px-4
      relative overflow-hidden"
    >
      <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-10 right-10"></div>

      <Card className="w-full max-w-md shadow-2xl rounded-2xl p-6 relative z-10">
        {step === "upload" && (
          <>
            <div className="text-center mb-6">
              <Title level={3}>Start Your Interview</Title>
              <Text type="secondary">
                Upload your resume to begin the AI-powered interview.
              </Text>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Upload
                accept=".pdf,.doc,.docx"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleUpload(file);
                  return false;
                }}
              >
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  loading={loading}
                  block
                  size="large"
                >
                  Upload Resume (PDF/DOCX)
                </Button>
              </Upload>
            </div>
          </>
        )}

        {step === "fillFields" && (
          <Space direction="vertical" className="w-full" size="middle">
            <Input
              placeholder="Full Name"
              value={fields.name}
              onChange={(e) => setFields({ ...fields, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={fields.email}
              onChange={(e) => setFields({ ...fields, email: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={fields.phone}
              onChange={(e) => setFields({ ...fields, phone: e.target.value })}
            />
            <Button
              type="primary"
              block
              size="large"
              onClick={handleFieldSubmit}
            >
              Continue to Interview
            </Button>
          </Space>
        )}

        {step === "generating" && (
          <div className="text-center space-y-4">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
            />
            <Title level={4}>Generating your questions...</Title>
            <Text type="secondary">
              Please wait while we prepare personalized interview questions.
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResumeUpload;
