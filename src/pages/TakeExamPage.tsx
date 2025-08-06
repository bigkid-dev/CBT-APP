import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Exam, ExamResult, CLASSES } from '../types';
import { storageUtils } from '../utils/storage';
import { isExamActive, formatDuration, formatDateTime } from '../utils/dateUtils';

export function TakeExamPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'select' | 'exam' | 'completed'>('select');
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState<string>('JSS1');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStartTime, setExamStartTime] = useState<number>(0);

  useEffect(() => {
    const exams = storageUtils.getExams()
      .filter(exam => exam.isPublished && isExamActive(exam.startTime, exam.endTime));
    setAvailableExams(exams);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (step === 'exam' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
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
      alert('Please enter your name and select an exam');
      return;
    }

    setStep('exam');
    setTimeLeft(selectedExam.timeLimit * 60);
    setExamStartTime(Date.now());
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const selectAnswer = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const nextQuestion = () => {
    if (selectedExam && currentQuestionIndex < selectedExam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitExam = () => {
    if (!selectedExam) return;

    const timeTaken = Math.floor((Date.now() - examStartTime) / 1000);
    let score = 0;

    selectedExam.questions.forEach(question => {
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
      timeTaken
    };

    storageUtils.saveResult(result);
    setStep('completed');
  };

  const getResult = (): ExamResult | null => {
    if (!selectedExam) return null;
    
    let score = 0;
    selectedExam.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    return {
      id: '',
      examId: selectedExam.id,
      studentName,
      studentClass,
      score,
      totalQuestions: selectedExam.questions.length,
      answers,
      dateTaken: new Date().toISOString(),
      timeTaken: 0
    };
  };

  if (step === 'select') {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Take Exam</h1>

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
                {CLASSES.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
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
                    .filter(exam => exam.class === studentClass)
                    .map((exam) => (
                      <div
                        key={exam.id}
                        className={`p-4 border rounded-md cursor-pointer transition-colors ${
                          selectedExam?.id === exam.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedExam(exam)}
                      >
                        <h3 className="font-medium text-gray-900">{exam.title}</h3>
                        <p className="text-sm text-gray-600">
                          {exam.subject} • {exam.questions.length} questions • {exam.timeLimit} minutes
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
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  if (step === 'exam' && selectedExam) {
    const currentQuestion = selectedExam.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedExam.questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{selectedExam.title}</h1>
            <div className="text-lg font-medium text-red-600">
              Time Left: {formatDuration(timeLeft)}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Question {currentQuestionIndex + 1} of {selectedExam.questions.length}
            </p>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuestion.text}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                    answers[currentQuestion.id] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => selectAnswer(currentQuestion.id, index)}
                    className="mr-3"
                  />
                  <span>{String.fromCharCode(65 + index)}. {option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md transition-colors"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {currentQuestionIndex < selectedExam.questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submitExam}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Submit Exam
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-medium text-gray-900 mb-3">Question Navigation</h3>
          <div className="grid grid-cols-10 gap-2">
            {selectedExam.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-500 text-white'
                    : answers[selectedExam.questions[index].id] !== undefined
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'completed') {
    const result = getResult();
    
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Exam Completed!</h1>
          
          {result && (
            <div className="space-y-4 mb-6">
              <div className="text-lg">
                <span className="font-medium">Score: </span>
                <span className="text-2xl font-bold text-blue-600">
                  {result.score}/{result.totalQuestions}
                </span>
                <span className="text-gray-600 ml-2">
                  ({Math.round((result.score / result.totalQuestions) * 100)}%)
                </span>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Question Breakdown</h3>
                <div className="space-y-2">
                  {selectedExam?.questions.map((question, index) => {
                    const isCorrect = answers[question.id] === question.correctAnswer;
                    return (
                      <div
                        key={question.id}
                        className={`p-3 rounded-md ${
                          isCorrect ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Question {index + 1}</span>
                          <span className={`font-medium ${
                            isCorrect ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {isCorrect ? '✓ Correct' : '✗ Wrong'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{question.text}</p>
                        <div className="text-sm mt-2">
                          <span className="text-gray-600">Your answer: </span>
                          <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                            {answers[question.id] !== undefined 
                              ? `${String.fromCharCode(65 + answers[question.id])}. ${question.options[answers[question.id]]}`
                              : 'Not answered'
                            }
                          </span>
                          {!isCorrect && (
                            <div>
                              <span className="text-gray-600">Correct answer: </span>
                              <span className="text-green-700">
                                {String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
}
