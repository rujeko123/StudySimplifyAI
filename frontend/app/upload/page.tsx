"use client";

import { useState } from "react";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [flashcards, setFlashcards] = useState("");
  const [activeCard, setActiveCard] = useState<number | null>(null);

  function handleFile(file: File) {
    setSelectedFile(file);
  }

  async function handleSummarize() {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("/api/extract", {
      method: "POST",
      body: formData,
    });

   const data = await response.json();

console.log(data);

setResult(data.summary);
setFlashcards(data.flashcards);
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl">

        <h1 className="text-4xl font-bold text-blue-600 mb-3">
          Upload Your Notes
        </h1>

        <p className="text-gray-600 mb-8">
          Drag and drop your PDF, Word or PowerPoint file below.
        </p>

        <label
          className="border-4 border-dashed border-blue-400 rounded-2xl h-72 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();

            if (e.dataTransfer.files.length > 0) {
              handleFile(e.dataTransfer.files[0]);
            }
          }}
        >
          <div className="text-6xl mb-4">📂</div>

          <p className="text-xl font-semibold">
            Drag & Drop Your Notes Here
          </p>

          <p className="text-gray-500 mt-2">
            or click to browse
          </p>

          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) {
                handleFile(e.target.files[0]);
              }
            }}
          />
        </label>

        {selectedFile && (
          <div className="mt-8 bg-green-100 border border-green-300 rounded-xl p-5">
            <h2 className="font-bold text-lg">
              ✅ File Selected
            </h2>

            <p className="mt-2">
              {selectedFile.name}
            </p>
          </div>
        )}

        <button
          onClick={handleSummarize}
          className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Summarize with AI
        </button>

        {result && (
          <div className="mt-8 bg-white border rounded-xl p-6 shadow">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              📚 Study Results
            </h2>

   <div className="whitespace-pre-wrap text-gray-700">
  {result}
</div> 
          </div>
        )}
      {flashcards && (
  <div className="mt-8 bg-blue-50 border rounded-xl p-6 shadow">

    <h2 className="text-2xl font-bold text-blue-600 mb-4">
      🧠 Interactive Flashcards
    </h2>

    <div className="space-y-4">

  {flashcards
    .split("=================================")
    .filter(card => card.trim() !== "")
    .map((card, index) => (

      <div
        key={index}
        onClick={() =>
          setActiveCard(activeCard === index ? null : index)
        }
        className="cursor-pointer bg-white border rounded-xl p-6 shadow hover:shadow-lg transition"
      >

        {activeCard === index ? (
          <div className="whitespace-pre-wrap text-gray-700">
            {card}
          </div>
        ) : (
          <h3 className="text-xl font-bold text-blue-600">
            🧠 Flashcard {index + 1}
            <br />
            <span className="text-gray-500 text-base">
              Click to reveal answer
            </span>
          </h3>
        )}

      </div>

    ))}

</div>

  </div>
)}  

      </div>
    </main>
  );
}