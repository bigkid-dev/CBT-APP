import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Exam, CLASSES } from '../types';
import { storageUtils } from '../utils/storage';
import { formatDateTime } from '../utils/dateUtils';

export function ManageExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  useEffect(() => {
    setExams(storageUtils.getExams());
  }, []);

  const togglePublish = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
      const updatedExam = { ...exam, isPublished: !exam.isPublished };
      storageUtils.saveExam(updatedExam);
      setExams(storageUtils.getExams());
    }
  };

  const deleteExam = (examId: string) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      storageUtils.deleteExam(examId);
      setExams(storageUtils.getExams());
    }
  };

  const saveEdit = () => {
    if (editingExam) {
      storageUtils.saveExam(editingExam);
      setExams(storageUtils.getExams());
      setEditingExam(null);
    }
  };

  const updateEditingExam = (field: keyof Exam, value: any) => {
    if (editingExam) {
      setEditingExam({ ...editingExam, [field]: value });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Exams</h1>
        <Link
          to="/create-exam"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Create New Exam
        </Link>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No exams created yet</p>
          <Link
            to="/create-exam"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors"
          >
            Create Your First Exam
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-lg shadow-md p-6">
              {editingExam?.id === exam.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editingExam.title}
                      onChange={(e) => updateEditingExam('title', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={editingExam.subject}
                      onChange={(e) => updateEditingExam('subject', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={editingExam.class}
                      onChange={(e) => updateEditingExam('class', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {CLASSES.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={editingExam.timeLimit}
                      onChange={(e) => updateEditingExam('timeLimit', parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                    <input
                      type="datetime-local"
                      value={editingExam.startTime}
                      onChange={(e) => updateEditingExam('startTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="datetime-local"
                      value={editingExam.endTime}
                      onChange={(e) => updateEditingExam('endTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingExam(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{exam.title}</h2>
                      <p className="text-gray-600">{exam.subject} - {exam.class}</p>
                      <p className="text-sm text-gray-500">
                        {exam.questions.length} questions • {exam.timeLimit} minutes
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          exam.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {exam.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <p>Start: {formatDateTime(exam.startTime)}</p>
                    <p>End: {formatDateTime(exam.endTime)}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingExam(exam)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => togglePublish(exam.id)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        exam.isPublished
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {exam.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
