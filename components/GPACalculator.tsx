import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';

interface Course {
  id: number;
  name: string;
  credits: string;
  grade: string;
}

const gradePoints: { [key: string]: number } = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0,
};

const GPACalculator: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: 'Example Course', credits: '3', grade: 'A' }
  ]);
  const [gpa, setGpa] = useState<number | null>(4.0);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: '', credits: '', grade: 'A' }]);
  };

  const handleCourseChange = (id: number, field: keyof Omit<Course, 'id'>, value: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  
  const removeCourse = (id: number) => {
    setCourses(courses.filter(c => c.id !== id));
  }

  const calculateGpa = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
      const credits = parseFloat(course.credits);
      const points = gradePoints[course.grade];
      if (!isNaN(credits) && credits > 0 && points !== undefined) {
        totalPoints += credits * points;
        totalCredits += credits;
      }
    }

    setGpa(totalCredits > 0 ? totalPoints / totalCredits : null);
  };
  
  const handleReset = () => {
      setCourses([{ id: 1, name: 'Example Course', credits: '3', grade: 'A' }]);
      setGpa(4.0);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
            <h3 className="text-lg text-gray-600 dark:text-gray-400">Your GPA is</h3>
            <p className="text-5xl font-extrabold text-brand-primary dark:text-brand-accent my-2">
                {gpa !== null ? gpa.toFixed(2) : 'N/A'}
            </p>
        </div>
      
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-3">
          {courses.map(course => (
            <div key={course.id} className="grid grid-cols-12 gap-2 items-center">
              <input type="text" placeholder="Course Name" value={course.name} onChange={e => handleCourseChange(course.id, 'name', e.target.value)} className="col-span-5 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              <input type="number" placeholder="Credits" value={course.credits} onChange={e => handleCourseChange(course.id, 'credits', e.target.value)} className="col-span-3 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" min="0" />
              <select value={course.grade} onChange={e => handleCourseChange(course.id, 'grade', e.target.value)} className="col-span-3 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600">
                {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <button onClick={() => removeCourse(course.id)} className="col-span-1 text-gray-400 hover:text-red-500"><CloseIcon className="w-5 h-5 mx-auto"/></button>
            </div>
          ))}
          <button onClick={addCourse} className="w-full mt-2 text-sm font-semibold text-brand-primary dark:text-brand-accent hover:underline">
            + Add Another Course
          </button>
        </div>

        <div className="mt-6 flex gap-4">
            <button onClick={calculateGpa} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors">Calculate GPA</button>
            <button onClick={handleReset} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">Reset</button>
        </div>
      </div>
    </div>
  );
};

export default GPACalculator;