// pages/quiz.tsx
import { useState } from "react"
import { useRouter } from "next/router"

const questions = [
  {
    id: "q1",
    dimension: "E vs I",
    text: "คุณรู้สึกเติมพลังเมื่อได้อยู่กับผู้คน หรืออยู่คนเดียว?",
    options: ["Extraversion", "Introversion"],
  },
  {
    id: "q2",
    dimension: "S vs N",
    text: "คุณให้ความสำคัญกับข้อเท็จจริงหรือความเป็นไปได้มากกว่า?",
    options: ["Sensing", "Intuition"],
  },
  {
    id: "q3",
    dimension: "T vs F",
    text: "คุณใช้เหตุผลหรือความรู้สึกตัดสินใจมากกว่า?",
    options: ["Thinking", "Feeling"],
  },
  {
    id: "q4",
    dimension: "J vs P",
    text: "คุณชอบวางแผนหรือปรับตามสถานการณ์?",
    options: ["Judging", "Perceiving"],
  },
]

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleAnswer = (choice: string) => {
    const updated = { ...answers, [questions[step].id]: choice }
    setAnswers(updated)
    if (step + 1 < questions.length) {
      setStep(step + 1)
    } else {
      submit(updated)
    }
  }

  const submit = async (finalAnswers: Record<string, string>) => {
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: finalAnswers }),
    })

    const { resultId } = await res.json()
    router.push(`/result/${resultId}`)
  }

  const current = questions[step]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-black transition-colors">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-2 text-center text-blue-600 dark:text-white">
          MBTI Quiz ({step + 1}/{questions.length})
        </h1>
        <p className="text-lg mb-4 text-center text-gray-700 dark:text-gray-300">
          {current.text}
        </p>

        <div className="flex flex-col gap-4">
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
            >
              {opt}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            className="mt-6 text-sm underline text-gray-500"
            onClick={() => setStep(step - 1)}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}
