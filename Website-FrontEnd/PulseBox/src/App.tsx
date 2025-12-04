import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ClassesProvider } from './context/ClassesContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { HomeworkProvider } from './context/HomeworkContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ClassesPage from './pages/ClassesPage';
import CreateClassPage from './pages/CreateClassPage';
import ClassDetailsPage from './pages/ClassDetailsPage';
import MarkAttendancePage from './pages/MarkAttendancePage';
import ProfilePage from './pages/ProfilePage';
import QuizzesPage from './pages/QuizzesPage';
import LessonPlansPage from './pages/LessonPlansPage';
import AttendancePage from './pages/AttendancePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import AssignHomeworkPage from './pages/AssignHomeworkPage';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isAppPage = location.pathname.startsWith('/app');

  return (
    <div className="app">
      {!isAuthPage && !isAppPage && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/app" element={<DashboardPage />} />
        <Route path="/app/classes" element={<ClassesPage />} />
        <Route path="/app/classes/create" element={<CreateClassPage />} />
        <Route path="/app/classes/edit/:id" element={<CreateClassPage />} />
        <Route path="/app/classes/:id" element={<ClassDetailsPage />} />
        <Route path="/app/mark-attendance" element={<MarkAttendancePage />} />
        <Route path="/app/quizzes" element={<QuizzesPage />} />
        <Route path="/app/quizzes/create" element={<QuizzesPage />} />
        <Route path="/app/lesson-plans" element={<LessonPlansPage />} />
        <Route path="/app/attendance" element={<AttendancePage />} />
        <Route path="/app/homework" element={<AssignHomeworkPage />} />
        <Route path="/app/analytics" element={<AnalyticsPage />} />
        <Route path="/app/profile" element={<ProfilePage />} />
        <Route path="/app/settings" element={<SettingsPage />} />
      </Routes>
      {!isAuthPage && !isAppPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ClassesProvider>
        <AttendanceProvider>
          <HomeworkProvider>
            <Router>
              <ScrollToTop />
              <AppContent />
            </Router>
          </HomeworkProvider>
        </AttendanceProvider>
      </ClassesProvider>
    </ThemeProvider>
  );
}

export default App;
