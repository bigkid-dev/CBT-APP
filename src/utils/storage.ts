import { Exam, ExamResult } from '../types';

const EXAMS_KEY = 'cbt_exams';
const RESULTS_KEY = 'cbt_results';

export const storageUtils = {
  // Exam operations
  getExams(): Exam[] {
    const exams = localStorage.getItem(EXAMS_KEY);
    return exams ? JSON.parse(exams) : [];
  },

  saveExam(exam: Exam): void {
    const exams = this.getExams();
    const existingIndex = exams.findIndex(e => e.id === exam.id);
    
    if (existingIndex >= 0) {
      exams[existingIndex] = exam;
    } else {
      exams.push(exam);
    }
    
    localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
  },

  deleteExam(examId: string): void {
    const exams = this.getExams().filter(e => e.id !== examId);
    localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
  },

  getExam(examId: string): Exam | undefined {
    return this.getExams().find(e => e.id === examId);
  },

  // Result operations
  getResults(): ExamResult[] {
    const results = localStorage.getItem(RESULTS_KEY);
    return results ? JSON.parse(results) : [];
  },

  saveResult(result: ExamResult): void {
    const results = this.getResults();
    results.push(result);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  },

  getResultsByExam(examId: string): ExamResult[] {
    return this.getResults().filter(r => r.examId === examId);
  },

  getResultsByClass(className: string): ExamResult[] {
    return this.getResults().filter(r => r.studentClass === className);
  }
};
