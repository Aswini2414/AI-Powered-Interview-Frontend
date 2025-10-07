import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { generateQuestions } from "../../utils/questionGenerator";

export const startInterviewWithSkills = createAsyncThunk(
  "sessions/startWithSkills",
  async ({ candidateId, skills }, thunkAPI) => {
    const generated = await generateQuestions(skills);
    return { candidateId, questions: generated };
  }
);

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    candidateId: null,
    questions: [],
    currentIndex: 0,
    timer: 0,
    isRunning: true,
    lastUpdated: null,
    started: false,
    finished: false,
    answers: [],
  },
  reducers: {
    tickTimer(state) {
      if (state.timer > 0) {
        state.timer = state.timer - 1;
        state.lastUpdated = Date.now();
      }
    },
    setTimer(state, action) {
      state.timer = action.payload; // payload = seconds
      state.lastUpdated = Date.now();
    },
    startTimer(state) {
      state.isRunning = true;
      state.lastUpdated = Date.now();
    },
    pauseTimer(state) {
      state.isRunning = false;
    },
    resumeTimer(state) {
      state.isRunning = true;
      state.lastUpdated = Date.now();
    },
    nextQuestion(state) {
      state.currentIndex = state.currentIndex + 1;
      if (state.currentIndex < state.questions.length) {
        state.timer = state.questions[state.currentIndex].time;
        state.isRunning = true;
        state.lastUpdated = Date.now();
      }
    },
    addAnswer(state, action) {
      state.answers.push(action.payload);
    },
    finishInterview(state) {
      state.finished = true;
      state.isRunning = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(startInterviewWithSkills.fulfilled, (state, action) => {
      state.candidateId = action.payload.candidateId;
      state.questions = action.payload.questions;
      state.currentIndex = 0;
      state.timer = action.payload.questions[0]?.time || 20;
      state.started = true;
      state.answers = [];
      state.isRunning = true;
      state.lastUpdated = Date.now();
    });
  },
});

export const {
  tickTimer,
  setTimer,
  nextQuestion,
  addAnswer,
  finishInterview,
  startTimer,
  pauseTimer,
  resumeTimer,
} = sessionSlice.actions;

export default sessionSlice.reducer;
