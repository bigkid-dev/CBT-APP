import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Exam, Question, CLASSES } from '../types';
import { storageUtils } from '../utils/storage';

export function CreateExamPage() {
  const navigate = useNavigate();
  const [exam, setExam] = useState<Partial<Exam>>({
    title: '',
    subject: '',
    class: 'JSS1',
    timeLimit: 60,
    startTime: '',
    endTime: '',
    questions: [],
    isPublished: false
  });

  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const handleExamChange = (field: keyof Exam, value: any) => {
    setExam(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (field: keyof Question, value: any) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || ['', '', '', ''])];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const addQuestion = () => {
    if (!currentQuestion.text || !currentQuestion.options?.every(opt => opt.trim())) {
      alert('Please fill in all question fields');
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      text: currentQuestion.text,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer || 0
    };

    setExam(prev => ({
      ...prev,
      questions: [...(prev.questions || []), question]
    }));

    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
  };

  const removeQuestion = (questionId: string) => {
    setExam(prev => ({
      ...prev,
      questions: prev.questions?.filter(q => q.id !== questionId) || []
    }));
  };

  const saveExam = () => {
    if (!exam.title || !exam.subject || !exam.startTime || !exam.endTime || !exam.questions?.length) {
      alert('Please fill in all required fields and add at least one question');
      return;
    }

    const newExam: Exam = {
      id: Date.now().toString(),
      title: exam.title,
      subject: exam.subject,
      class: exam.class || 'JSS1',
      timeLimit: exam.timeLimit || 60,
      startTime: exam.startTime,
      endTime: exam.endTime,
      questions: exam.questions,
      isPublished: false,
      createdAt: new Date().toISOString()
    };

    storageUtils.saveExam(newExam);
    alert('Exam created successfully!');
    navigate('/manage-exams');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Exam</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Exam Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Title *
            </label>
            <input
              type="text"
              value={exam.title || ''}
              onChange={(e) => handleExamChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter exam title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={exam.subject || ''}
              onChange={(e) => handleExamChange('subject', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class *
            </label>
            <select
              value={exam.class || 'JSS1'}
              onChange={(e) => handleExamChange('class', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CLASSES.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Limit (minutes) *
            </label>
            <input
              type="number"
              value={exam.timeLimit || 60}
              onChange={(e) => handleExamChange('timeLimit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time *
            </label>
            <input
              type="datetime-local"
              value={exam.startTime || ''}
              onChange={(e) => handleExamChange('startTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time *
            </label>
            <input
              type="datetime-local"
              value={exam.endTime || ''}
              onChange={(e) => handleExamChange('endTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Question</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Text *
          </label>
          <textarea
            value={currentQuestion.text || ''}
            onChange={(e) => handleQuestionChange('text', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter question text"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Option {String.fromCharCode(65 + index)} *
              </label>
              <input
                type="text"
                value={currentQuestion.options?.[index] || ''}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correct Answer *
          </label>
          <select
            value={currentQuestion.correctAnswer || 0}
            onChange={(e) => handleQuestionChange('correctAnswer', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[0, 1, 2, 3].map((index) => (
              <option key={index} value={index}>
                Option {String.fromCharCode(65 + index)}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={addQuestion}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Add Question
        </button>
      </div>

      {exam.questions && exam.questions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Questions ({exam.questions.length})
          </h2>
          
          {exam.questions.map((question, index) => (
            <div key={question.id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">
                  {index + 1}. {question.text}
                </h3>
                <button
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-2 rounded ${
                      optIndex === question.correctAnswer
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100'
                    }`}
                  >
                    {String.fromCharCode(65 + optIndex)}. {option}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={saveExam}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          Save Exam
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
