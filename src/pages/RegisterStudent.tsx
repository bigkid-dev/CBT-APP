import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Exam, ExamResult, CLASSES } from "../types";
import { storageUtils } from "../utils/storage";
import {
  isExamActive,
  formatDuration,
  formatDateTime,
} from "../utils/dateUtils";

export function RegisterStudentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"select" | "exam" | "completed">("select");
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState<string>("JSS1");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStartTime, setExamStartTime] = useState<number>(0);

  useEffect(() => {
    const exams = storageUtils
      .getExams()
      .filter(
        (exam) => exam.isPublished && isExamActive(exam.startTime, exam.endTime)
      );
    setAvailableExams(exams);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (step === "exam" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const startExam = () => {
    if (!studentName.trim() || !selectedExam) {
      alert("Please enter your name and select an exam");
      return;
    }

    setStep("exam");
    setTimeLeft(selectedExam.timeLimit * 60);
    setExamStartTime(Date.now());
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const selectAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const nextQuestion = () => {
    if (
      selectedExam &&
      currentQuestionIndex < selectedExam.questions.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitExam = () => {
    if (!selectedExam) return;

    const timeTaken = Math.floor((Date.now() - examStartTime) / 1000);
    let score = 0;

    selectedExam.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    const result: ExamResult = {
      id: Date.now().toString(),
      examId: selectedExam.id,
      studentName,
      studentClass,
      score,
      totalQuestions: selectedExam.questions.length,
      answers,
      dateTaken: new Date().toISOString(),
      timeTaken,
    };

    storageUtils.saveResult(result);
    setStep("completed");
  };

  const getResult = (): ExamResult | null => {
    if (!selectedExam) return null;

    let score = 0;
    selectedExam.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    return {
      id: "",
      examId: selectedExam.id,
      studentName,
      studentClass,
      score,
      totalQuestions: selectedExam.questions.length,
      answers,
      dateTaken: new Date().toISOString(),
      timeTaken: 0,
    };
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Register Student
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Class *
            </label>
            <select
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Exams
            </label>
            {availableExams.length === 0 ? (
              <p className="text-gray-500">No exams available at this time</p>
            ) : (
              <div className="space-y-2">
                {availableExams
                  .filter((exam) => exam.class === studentClass)
                  .map((exam) => (
                    <div
                      key={exam.id}
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        selectedExam?.id === exam.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => setSelectedExam(exam)}
                    >
                      <h3 className="font-medium text-gray-900">
                        {exam.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {exam.subject} • {exam.questions.length} questions •{" "}
                        {exam.timeLimit} minutes
                      </p>
                      <p className="text-xs text-gray-500">
                        Available until: {formatDateTime(exam.endTime)}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={startExam}
          disabled={!studentName.trim() || !selectedExam}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          Register Exam
        </button>
      </div>
    </div>
  );
}
