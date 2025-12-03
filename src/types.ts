export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  class: string;
  timeLimit: number; // in minutes
  startTime: string;
  endTime: string;
  questions: Question[];
  isPublished: boolean;
  createdAt: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentName: string;
  studentClass: string;
  score: number;
  totalQuestions: number;
  answers: Record<string, number>;
  dateTaken: string;
  timeTaken: number; // in seconds
}

export interface StudentAnswer {
  questionId: string;
  selectedAnswer: number;
}

export const CLASSES = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"] as const;

export const SUBJECTS = [
  "Computer_Science",
  "English_Language",
  "Mathematics",
  "Fine_Art",
  "Civic",
  "History",
  "PVS",
  "BST",
  "PHE",
  "Yoruba",
  "Data",
  "Business_Studies",
  "Economics",
] as const;

export type ClassType = (typeof CLASSES)[number];

export interface Student {
  firstname: string;
  lastname: string;
  class: string;
}

type Subject = (typeof SUBJECTS)[number];

export interface Teacher {
  firstname: string;
  lastname: string;
  subject: Subject[];
}
