import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ClassesProvider } from './context/ClassesContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { HomeworkProvider } from './context/HomeworkContext';
import { TasksProvider } from './context/TasksContext';
import { ScheduleProvider } from './context/ScheduleContext';
import { ConfirmModalProvider } from './context/ConfirmModalContext';
import { AlertModalProvider } from './context/AlertModalContext';
import { ResponsesProvider } from './context/ResponsesContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ClassesPage from './pages/ClassesPage';
import CreateClassPage from './pages/CreateClassPage';
import ClassDetailsPage from './pages/ClassDetailsPage';
import MarkAttendancePage from './pages/MarkAttendancePage';
import ProfilePage from './pages/ProfilePage';
import MyTasksPage from './pages/MyTasksPage';
import LessonPlansPage from './pages/LessonPlansPage';
import AttendancePage from './pages/AttendancePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import AssignHomeworkPage from './pages/AssignHomeworkPage';
import CreateTaskPage from './pages/CreateTaskPage';
import QuestionsScreen from './pages/QuestionsScreen';
import PublishingScreen from './pages/PublishingScreen';
import TaskDetailsPage from './pages/TaskDetailsPage';
import SchedulePage from './pages/SchedulePage';
import PreviewTask from './pages/PreviewTask';
import MainTask from './pages/MainTask';
import ResponsesPage from './pages/ResponsesPage';
import GradeResponsePage from './pages/GradeResponsePage';
import StudentProfilePage from './pages/StudentProfilePage';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';
  const isAppPage = location.pathname.startsWith('/app');
  const isPreviewTask = location.pathname.startsWith('/task/') && !location.pathname.includes('/take');
  const isMainTask = location.pathname.startsWith('/task/') && location.pathname.includes('/take');

  // Don't show navbar on auth pages, app pages, preview task, or main task (taking task) screens
  const shouldShowNavbar = !isAuthPage && !isAppPage && !isPreviewTask && !isMainTask;

  return (
    <ErrorBoundary>
      <div className={`app ${isAuthPage ? 'auth-page' : ''}`}>
        {shouldShowNavbar && <Navbar />}
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/app" element={<DashboardPage />} />
        <Route path="/app/classes" element={<ClassesPage />} />
        <Route path="/app/classes/create" element={<CreateClassPage />} />
        <Route path="/app/classes/edit/:id" element={<CreateClassPage />} />
        <Route path="/app/classes/:id" element={<ClassDetailsPage />} />
        <Route path="/app/classes/:classId/students/:studentId" element={<StudentProfilePage />} />
        <Route path="/app/mark-attendance" element={<MarkAttendancePage />} />
        <Route path="/app/tasks" element={<MyTasksPage />} />
        <Route path="/app/tasks/create" element={<CreateTaskPage />} />
        <Route path="/app/tasks/:taskId" element={<TaskDetailsPage />} />
        <Route path="/app/tasks/:taskId/questions" element={<QuestionsScreen />} />
        <Route path="/app/tasks/:taskId/publish" element={<PublishingScreen />} />
        <Route path="/app/quizzes/create" element={<CreateTaskPage />} />
        <Route path="/app/lesson-plans" element={<LessonPlansPage />} />
        <Route path="/app/attendance" element={<AttendancePage />} />
        <Route path="/app/homework" element={<AssignHomeworkPage />} />
        <Route path="/app/analytics" element={<AnalyticsPage />} />
        <Route path="/app/schedule" element={<SchedulePage />} />
        <Route path="/app/responses" element={<ResponsesPage />} />
        <Route path="/app/responses/:responseId/grade" element={<GradeResponsePage />} />
        <Route path="/app/profile" element={<ProfilePage />} />
        <Route path="/app/settings" element={<SettingsPage />} />
        <Route path="/task/:taskId" element={<PreviewTask />} />
        <Route path="/task/:taskId/take" element={<MainTask />} />
        </Routes>
        {shouldShowNavbar && <Footer />}
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ClassesProvider>
          <AttendanceProvider>
            <HomeworkProvider>
              <TasksProvider>
                <ResponsesProvider>
                  <ScheduleProvider>
                    <ConfirmModalProvider>
                      <AlertModalProvider>
                        <Router>
                          <ScrollToTop />
                          <AppContent />
                        </Router>
                      </AlertModalProvider>
                    </ConfirmModalProvider>
                  </ScheduleProvider>
                </ResponsesProvider>
              </TasksProvider>
            </HomeworkProvider>
          </AttendanceProvider>
        </ClassesProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
