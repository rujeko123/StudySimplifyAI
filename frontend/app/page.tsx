import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Navigation */}
      <nav className="flex justify-between items-center px-10 py-6 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">
          StudySimplify AI
        </h1>

        <div className="space-x-6">
          <a href="#" className="hover:text-blue-600">Features</a>
          <a href="#" className="hover:text-blue-600">Pricing</a>
          <a href="#" className="hover:text-blue-600">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 px-6">
        <h2 className="text-6xl font-extrabold text-slate-800 mb-6">
          Learn Faster with AI
        </h2>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Upload your lecture notes and let artificial intelligence create
          summaries, simple explanations, quizzes and flashcards in seconds.
        </p>

       <Link
  href="/upload"
  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold inline-block"
>
  Upload Notes
</Link>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-bold text-center mb-14">
          Everything You Need To Study Better
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-2xl font-bold mb-3">📄 AI Summaries</h3>
            <p>Create short, clear summaries from long lecture notes.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-2xl font-bold mb-3">💡 Simple Explanations</h3>
            <p>Understand difficult concepts in plain English.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-2xl font-bold mb-3">📝 AI Quizzes</h3>
            <p>Generate revision questions instantly.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-2xl font-bold mb-3">🧠 Flashcards</h3>
            <p>Create flashcards automatically for revision.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-2xl font-bold mb-3">📥 PDF Download</h3>
            <p>Download summaries for offline studying.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-2xl font-bold mb-3">⚡ Fast AI</h3>
            <p>Get results in just a few seconds.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white text-center py-8">
        © 2026 StudySimplify AI. All Rights Reserved.
      </footer>

    </main>
  );
}