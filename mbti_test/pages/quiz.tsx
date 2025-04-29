// pages/quiz.tsx

import { useSession } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/router"

export default function QuizPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const [step, setStep] = useState(0)

  const questions = [
    { id: "q1", text: "You prefer to focus on the outer world or your own inner world?", options: ["Extraversion", "Introversion"] },
    { id: "q2", text: "You tend to focus on the reality or the possibilities?", options: ["Sensing", "Intuition"] },
    { id: "q3", text: "You base decisions on logic or personal values?", options: ["Thinking", "Feeling"] },
    { id: "q4", text: "You prefer structure or flexibility?", options: ["Judging", "Perceiving"] }
  ]

  const handleAnswer = (choice: string) => {
    const updated = { ...answers, [questions[step].id]: choice }
    setAnswers(updated)
    if (step + 1 < questions.length) setStep(step + 1)
    else submit(updated)
  }

  const submit = async (finalAnswers: Record<string, string>) => {
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: finalAnswers })
    })

    const { resultId } = await res.json()
    router.push(`/result/${resultId}`)
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">MBTI Quiz</h1>
      {questions[step] && (
        <div>
          <p className="mb-2">{questions[step].text}</p>
          {questions[step].options.map((opt) => (
            <button key={opt} className="mr-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => handleAnswer(opt)}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
