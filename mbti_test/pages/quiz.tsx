import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ChevronLeft, Brain,  AlertCircle } from "lucide-react";

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
];

export default function QuizPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkRedirect = async () => {
      if (status === "loading") return;
      if (!session) {
        router.push("/login");
        return;
      }

      if (session.user?.hasMbtiCard) {
        router.replace("/dashboard");
      }
    };

    checkRedirect();
  }, [session, status, router]);

  const handleAnswer = (choice: string) => {
    if (isSubmitting) return;

    const updated = { ...answers, [questions[step].id]: choice };
    setAnswers(updated);
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      submit(updated);
    }
  };

  const submit = async (finalAnswers: Record<string, string>) => {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });

      if (res.status === 409) {
        setError("You have already completed the quiz.");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to submit quiz.");
      }

      const result = await res.json();
      console.log("Quiz submit result:", result);

      router.replace("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const current = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            MBTI Personality Quiz
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover your personality type through our comprehensive assessment
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Question {step + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Quiz Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-8">
            {/* Question */}
            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full mb-4">
                {current.dimension}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
                {current.text}
              </h2>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Answer Options */}
            <div className="space-y-4">
              {current.options.map((option, index) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={isSubmitting}
                  className="w-full p-4 text-left border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full mr-4 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors duration-200" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {option}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {String.fromCharCode(65 + index)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              {step > 0 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center space-x-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index < step
                        ? 'bg-green-500'
                        : index === step
                        ? 'bg-blue-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Completion Indicator */}
        {isSubmitting && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
              Processing your results...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
