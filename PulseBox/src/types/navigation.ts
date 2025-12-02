export type RootStackParamList = {
  GetStarted: undefined;
  Onboarding01: undefined;
  Onboarding02: undefined;
  Onboarding03: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined; // Teacher Dashboard
  MyForms: undefined; // Legacy route (now Quizzes)
  MyClasses: undefined; // My Classes
  Quizzes: undefined; // Quizzes & Assignments
  Responses: undefined; // Students
  Settings: undefined;
  MainScreen: undefined;
  // Teacher-specific screens
  CreateClass: undefined;
  ClassDetails: { classId: string };
  LessonPlanner: undefined;
  Attendance: { classId: string };
  Grading: { assignmentId?: string; classId?: string };
  StudentProfile: { studentId: string };
  CreateAssignment: { classId: string };
  ParentCommunication: { studentId?: string };
  AIAssistant: undefined;
  Reports: undefined;
  // Legacy form screens (can be repurposed later)
  CreateForm: undefined;
  FormBuilder: { answers?: any };
  EditForm: { formId: string };
  QuestionsScreen: { formId: string; questionId: string };
  SwapQuestions: { formId: string };
  ShareForm: { formId: string };
};


