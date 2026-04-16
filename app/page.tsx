"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAnalyze = () => {
    setError("");

    let owner = "";
    let repo = "";

    if (input.includes("github.com")) {
      const parts = input.replace("https://", "").replace("http://", "").split("/");
      owner = parts[1];
      repo = parts[2];
    } else if (input.includes("/")) {
      const parts = input.split("/");
      owner = parts[0];
      repo = parts[1];
    }

    if (!owner || !repo) {
      setError("Please enter a valid repo e.g. - full GitHub URL");
      return;
    }

    router.push(`/repo/${owner}/${repo}/analysis`);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <span className="text-xl font-bold text-blue-400">GitHub Repo Analyzer</span>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-28 gap-6">
        <h1 className="text-5xl font-extrabold leading-tight max-w-2xl">
          Analyze <span className="text-blue-400">GitHub Repo</span>
        </h1>
        <p className="text-gray-400 max-w-xl text-lg">
          Enter a GitHub repository to get a summary of it
        </p>

        {/* Search Bar */}
        <div className="flex flex-col items-center gap-2 mt-4 w-full max-w-lg">
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="Paste the GitHub repo...."
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAnalyze}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition"
            >
              Analyze
            </button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </section>

    </main>
  );
}

/* new react hooks*/