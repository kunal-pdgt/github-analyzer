"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnalysisPage() {
    const params = useParams();
    const owner = params.owner;
    const repo = params.repo;

    const [repoData, setRepoData] = useState<any>(null);
    const [summary, setSummary] = useState("");

    useEffect(() => {
        fetch(`https://api.github.com/repos/${owner}/${repo}`)
            .then((res) => res.json())
            .then((data) => {
                setRepoData(data);
                fetchSummary(data);
            });
    }, [owner, repo]);

    const fetchSummary = async (data: any) => {
        const prompt = `
      Github repository information:
      - Name: ${data.full_name}
      - Description: ${data.description}
      - Language: ${data.language}
      - Stars: ${data.stargazers_count}
      - Forks: ${data.forks_count}

      Give me a summary of this repository.
    `; { /*pass entire daat*/ }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );

        const result = await response.json();
        console.log(result);
        const text = result.candidates[0].content.parts[0].text;
        setSummary(text);
    };

    if (!repoData) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-gray-300">Loading...</p>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white">

            {/* nav */}
            <nav className="px-8 py-4 border-b border-gray-800">
                <span className="text-lg font-semibold text-blue-400">GitHub Repo Analyzer</span>
            </nav>

            {/* content */}
            <div className="max-w-2xl mx-auto px-6 py-12">

                {/* repo name */}
                <h1 className="text-3xl font-bold text-white">{repoData.full_name}</h1>

                {/* description */}
                <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                    {repoData.description}
                </p>

                {/* divider */}
                <div className="border-t border-gray-800 my-6" />

                {/* stats*/}
                <div className="flex gap-8">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Stars</p>
                        <p className="text-lg font-semibold text-white mt-1"> {repoData.stargazers_count}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Forks</p>
                        <p className="text-lg font-semibold text-white mt-1"> {repoData.forks_count}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Language</p>
                        <p className="text-lg font-semibold text-white mt-1"> {repoData.language}</p>
                    </div>
                </div>

                {/* divider */}
                <div className="border-t border-gray-800 my-6" />

                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">AI Summary</p>

                    <div className="relative bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <p className="text-gray-300 text-sm leading-relaxed pr-8">
                            {summary || "Generating summary..."}
                        </p>
                        <button onClick={() => navigator.clipboard.writeText(summary)}
                            className="absolute top-3 right-3 text-xs text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 rounded px-2 py-1 transition">
                            Copy
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}