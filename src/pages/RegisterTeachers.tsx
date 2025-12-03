import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CLASSES, Student, SUBJECTS } from "../types";
import { storageUtils } from "../utils/storage";
import {
  isExamActive,
  formatDuration,
  formatDateTime,
} from "../utils/dateUtils";

export function RegisterTeacherPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"select" | "exam" | "completed">("select");
  const [studentName, setStudentName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentClass, setStudentClass] = useState<string>("JSS1");

  const registerStudent = () => {
    if (studentName && studentClass) {
      const studentInfo: Student = {
        firstname: studentName,
        lastname: studentLastName,
        class: studentClass,
      };
      const allStudents = storageUtils.getStudentsInfo();
      console.log(allStudents);
      const studentExist = allStudents.some(
        (value) =>
          value.firstname === studentName &&
          value.lastname === studentLastName &&
          value.class === studentClass
      );
      if (!studentExist) {
        storageUtils.saveStudentinfo(studentInfo);
        alert("Done! User registered Successfully");
      } else {
        alert("This User exists");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Register Teachers
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Surname *
            </label>
            <input
              type="text"
              value={studentLastName}
              onChange={(e) => setStudentLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your surname"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
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
              {SUBJECTS.map((cls) => (
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
          </div>
        </div>

        <button
          onClick={registerStudent}
          disabled={
            !studentName.trim() ||
            !studentLastName.trim() ||
            !studentClass.trim()
          }
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          Register Exam
        </button>
      </div>
    </div>
  );
}
