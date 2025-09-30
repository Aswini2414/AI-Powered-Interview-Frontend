import { createSlice } from "@reduxjs/toolkit";

const candidatesSlice = createSlice({
    name: "candidates",
    initialState: [],
    reducers: {
        addCandidate: (state, action) => {
            state.push({
                ...action.payload,
                chatHistory: [],
                score: null,
                summary:"",
            })
        },
        addChatMessage: (state, action) => {
            const { candidateId, message } = action.payload;
            const candidate = state.find((c) => c.id === candidateId);
            if (candidate) {
                candidate.chatHistory.push(message);
            }
        },
        finalizeCandidate: (state, action) => {
            const { candidateId, score, summary } = action.payload;
            const candidate = state.find((c) => c.id === candidateId);
            if (candidate) {
                candidate.score = score;
                candidate.summary = summary;
            }
        }
    }
})

export const { addCandidate, addChatMessage, finalizeCandidate } = candidatesSlice.actions;

export default candidatesSlice.reducer;