import { useSelector } from "react-redux";
import { useState } from "react";

const Interviewer = () => {
  const candidates = useSelector((state) => state.candidates);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("score");

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "score") {
      return (b.score || 0) - (a.score || 0);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Interviewer Dashboard</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="score">Sort by Score</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((c) => (
          <div
            key={c.id}
            className="border p-4 rounded cursor-pointer hover:shadow"
            onClick={() => setSelectedCandidate(c)}
          >
            <h3 className="font-semibold text-lg">{c.name}</h3>
            <p>Email: {c.email}</p>
            <p>Phone: {c.phone}</p>
            <p className="font-bold">
              Score: {c.score !== null ? c.score : "Loading"}
            </p>
            <p className="text-sm text-gray-600">
              {c.summary ? c.summary : "Summary is Loading"}
            </p>
          </div>
        ))}
      </div>

      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-2">{selectedCandidate.name}</h2>
            <p>
              <b>Email:</b> {selectedCandidate.email}
            </p>
            <p>
              <b>Phone:</b> {selectedCandidate.phone}
            </p>
            <p>
              <b>Score:</b>{" "}
              {selectedCandidate.score !== null
                ? selectedCandidate.score
                : "Loading"}
            </p>
            <p>
              <b>Summary:</b>{" "}
              {selectedCandidate.summary || "Summary Loading..."}
            </p>

            <h3 className="font-semibold mt-4 mb-2">Chat History</h3>
            <div className="max-h-64 overflow-y-auto border p-2 rounded">
              {selectedCandidate.chatHistory.length > 0 ? (
                selectedCandidate.chatHistory.map((msg, idx) => (
                  <div key={idx} className="mb-2">
                    <b>{msg.role}:</b> {msg.text}
                  </div>
                ))
              ) : (
                <p>No chat history available.</p>
              )}
            </div>

            <button
              onClick={() => setSelectedCandidate(null)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interviewer;
