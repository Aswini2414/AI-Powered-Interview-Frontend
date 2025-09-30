import { useState } from "react";
import "./App.css";
import { Tabs } from "antd";
import Interviewee from "./Components/Interviewee";
import Interviewer from "./Components/Interviewer";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [activeTab, setActiveTab] = useState("interviewee");

  const items = [
    {
      key: "interviewee",
      label: "Interviewee (Chat)",
      children: <Interviewee />,
    },
    {
      key: "interviewer",
      label: "Interviewer (Dashboard)",
      children: <Interviewer />,
    },
  ];

  return (
    <div className="p-4">
      <Tabs
        activeKey={activeTab}
        items={items}
        onChange={setActiveTab}
        className="text-white"
      />
      <Toaster />
    </div>
  );
}

export default App;
