"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import { getSimpleExplanation } from "@/lib/explanations";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [flashcards, setFlashcards] = useState("");
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [simpleExplanation, setSimpleExplanation] = useState("");
  const [wordCount, setWordCount] = useState(0);
 const [readingTime, setReadingTime] = useState(0); 
 const [paragraphCount, setParagraphCount] = useState(0);
 const [characterCount, setCharacterCount] = useState(0);

  const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");

  function handleFile(file: File) {
    setSelectedFile(file);
  }
 function downloadNotes() {
  const doc = new jsPDF();

  const cleanContent = result.replace(
    /[^\x00-\x7F]/g,
    ""
  );

  doc.setFontSize(12);

  const lines = doc.splitTextToSize(cleanContent, 180);

  let y = 20;

  lines.forEach((line: string) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }

    doc.text(line, 10, y);
    y += 7;
  });

  doc.save("StudySimplifyAI-Notes.pdf");
}

  async function handleSummarize() {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }
    setLoading(true);

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
setLoading(false);
setWordCount(
  data.summary.split(/\s+/).filter(Boolean).length
);
setReadingTime(
  Math.ceil(
    data.summary.split(/\s+/).filter(Boolean).length / 200
  )
);
setParagraphCount(
  data.summary.split(/\n+/).filter(Boolean).length
);
setCharacterCount(data.summary.length);
  }

 function explainConcept(concept: string) {
  setSimpleExplanation(getSimpleExplanation(concept));
}
async function askTutor() {
  if (!question.trim()) {
    alert("Please enter a question.");
    return;
  }

  const response = await fetch("/api/explain", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
    }),
  });

  const data = await response.json();

  setAnswer(data.answer);
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
  disabled={loading}
  className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? "⏳ Processing your notes..." : "🤖 Summarize with AI"}
</button>      

        {result && (
          <div className="mt-8 bg-white border rounded-xl p-6 shadow">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              📚 Study Results
            </h2>
         <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
  <h3 className="font-bold text-blue-700">
    📊 Study Statistics
  </h3>

  <p className="mt-2 text-gray-700">
    📝 Words in your notes: {wordCount}
  </p>

  <p className="mt-2 text-gray-700">
    ⏱️ Estimated reading time: {readingTime} minutes
  </p>
  <p className="mt-2 text-gray-700">
  📄 Paragraphs: {paragraphCount}
</p>
<p className="mt-2 text-gray-700">
  🔤 Characters: {characterCount}
</p>
</div>

   <div className="whitespace-pre-wrap text-gray-700">
  {result}
</div> 
<button
  onClick={downloadNotes}
  className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
>
  ⬇️ Download Study Notes
</button>
<div className="mt-6 flex flex-wrap gap-3">

  

  

 

</div>
{simpleExplanation && (
  <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5">
    <h3 className="text-xl font-bold text-green-700 mb-2">
      💡 Simple Explanation
    </h3>

    <p>{simpleExplanation}</p>
  </div>
)}
<div className="mt-8 border-t pt-6">

  <h3 className="text-2xl font-bold text-purple-700 mb-4">
    🤖 Ask AI Tutor
  </h3>

  <input
    type="text"
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    placeholder="Ask a question about your notes..."
    className="w-full border rounded-xl p-3"
  />

  <button
    onClick={askTutor}
    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl"
  >
    Ask AI Tutor
  </button>

  {answer && (
    <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-5">
      <h4 className="text-xl font-bold text-purple-700 mb-2">
        💬 Answer
      </h4>

      <p>{answer}</p>
    </div>
  )}

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
       className="cursor-pointer bg-white border rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300"
      >

       {activeCard === index ? (
  <div className="text-gray-700">

    <h4 className="text-lg font-bold text-blue-600 mb-2">
      ❓ Question
    </h4>

    <p className="mb-6">
      {card
        .split("BACK:")[0]
        .replace("FRONT:", "")
        .trim()}
    </p>


    <h4 className="text-lg font-bold text-green-600 mb-2">
      ✅ Answer
    </h4>

    <p>
      {card
        .split("BACK:")[1]
        ?.trim()}
    </p>

  </div>
) : (
          <div className="text-center">

  <div className="text-4xl mb-3">
    🧠
  </div>

  <h3 className="text-2xl font-bold text-blue-600">
    Flashcard {index + 1}
  </h3>

  <p className="text-gray-500 mt-3">
    Click to reveal answer
  </p>

</div>
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