import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CreateExamPage } from './pages/CreateExamPage';
import { ManageExamsPage } from './pages/ManageExamsPage';
import { TakeExamPage } from './pages/TakeExamPage';
import { CheckResultsPage } from './pages/CheckResultsPage';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-exam" element={<CreateExamPage />} />
          <Route path="/manage-exams" element={<ManageExamsPage />} />
          <Route path="/take-exam" element={<TakeExamPage />} />
          <Route path="/check-results" element={<CheckResultsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
