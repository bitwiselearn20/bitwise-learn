export interface JwtPayload {
  id: string;
  type:
    | "SUPERADMIN"
    | "ADMIN"
    | "INSTITUTION"
    | "VENDOR"
    | "TEACHER"
    | "STUDENT";
}
export interface CourseBody {
  name: string;
  description: string;
  level: "BASIC" | "INTERMEDIATE" | "ADVANCE";
  duration?: string;
  instructorName: string;
}

export interface UpdateCourse {
  description: string;
  level: "BASIC" | "INTERMEDIATE" | "ADVANCE";
  duration?: string;
  instructorName: string;
}

export interface CourseContentBody {
  name: string;
  description?: string;
  sectionId: string;
  videoUrl: string;
  transcript?: string;
}

export interface updateCourseContent {
  name?: string;
  description?: string;
  videoUrl?: string;
  transcript?: string;
}

export interface CourseAssignmentBody {
  name: string;
  description: string;
  instruction: string;
  marksPerQuestion: number;
  sectionId: string;
}

export interface CourseAssignmentUpdate {
  description?: string;
  instruction?: string;
  marksPerQuestion?: number;
}

export interface AssignmentQuestionBody {
  question: string;
  options: string[];
  correctAnswer: string[];
  assignmentId: string;
  type?: "MCQ" | "SCQ";
}

export interface UpdateAssignment {
  question?: string;
  options?: string[];
  correctAnswer?: string[];
  type?: "MCQ" | "SCQ";
}

export interface CreateAdminBody {
  name: string;
  email: string;
}

export interface UpdateAdminBody {
  name?: string;
  email?: string;
  password?: string;
}

export interface CreateInstitutionBody {
  name: string;
  email: string;
  secondaryEmail?: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  address: string;
  pinCode: string;
  tagline: string;
  websiteLink: string;
  loginPassword: string;
}

export interface UpdateInstitutionBody {
  name?: string;
  email?: string;
  secondaryEmail?: string;
  phoneNumber?: string;
  secondaryPhoneNumber?: string;
  address?: string;
  pinCode?: string;
  tagline?: string;
  websiteLink?: string;
  loginPassword?: string;
}

export interface GradesBody {
  questionId: string;
  answer: string[];
}

export interface CreateTeacherBody {
  name: string;
  email: string;
  phoneNumber: string;
  loginPassword: string;
  instituteId: string;
  batchId: string;
  vendorId?: string;
}

export interface UpdateTeacherBody {
  name?: string;
  email?: string;
  phoneNumber?: string;
  loginPassword?: string;
  batchId?: string;
  vendorId?: string;
}

export interface DSAQuestionBody {
  name: string;
  description: string;
  hints: string[];
  mainFunction: string;
}

export interface ProblemBody {
  name: string;
  description: string;
  hints?: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface UpdateProblemBody {
  description?: string;
  hints?: string[];
  difficulty?: string;
}

export interface ProblemTemplate {
  functionBody: string;
  defaultCode: string;
  language: string;
}
export interface UpdateProblemTemplate {
  functionBody?: string;
  defaultCode?: string;
  language?: string;
}
export interface ProblemTestCaseBody {
  input: string;
  output: string;
  testType: "EXAMPLE" | "HIDDEN";
}
export interface UpdatedProblemTestCaseBody {
  input?: string;
  output?: string;
  testType?: "EXAMPLE" | "HIDDEN";
}
export interface ProblemSolution {
  solution: string;
  videoSolution: string;
}
export interface ProblemSubmission {
  code: string;
  runtime: string;
  memory: string;
}
export interface CreateTeacherBody {
  name: string;
  email: string;
  phoneNumber: string;
  loginPassword: string;
  instituteId: string;
  batchId: string;
  vendorId?: string;
}
export interface UpdateTeacherBody {
  name?: string;
  email?: string;
  phoneNumber?: string;
  loginPassword?: string;
  batchId?: string;
  vendorId?: string;
}
export interface CreateBatchBody {
  batchname: string;
  branch: string;
  batchEndYear: string;
  institutionId: string;
}
export interface UpdateBatchBody {
  batchname?: string;
  branch?: string;
  batchEndYear?: string;
}
export interface CreateVendorBody {
  name: string;
  email: string;
  secondaryEmail?: string;
  tagline: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  websiteLink: string;
}
export interface UpdateVendorBody {
  name?: string;
  email?: string;
  secondaryEmail?: string;
  tagline?: string;
  phoneNumber?: string;
  secondaryPhoneNumber?: string;
  websiteLink?: string;
  loginPassword?: string;
}
export interface CreateStudentBody {
  name: string;
  rollNumber: string;
  email: string;
  loginPassword: string;
  batchId: string;
}
export interface UpdateStudentBody {
  name?: string;
  rollNumber?: string;
  email?: string;
  loginPassword?: string;
  batchId?: string;
}
export interface CreateAssessment {
  name: string;
  description: string;
  instruction: string;
  startTime: string;
  endTime: string;
  individualSectionTimeLimit?: number;
  status?: "UPCOMING" | "LIVE" | "ENDED";
  batchId: string;
}
export interface UpdateAssessment {
  name?: string;
  description?: string;
  instruction?: string;
  startTime?: string;
  endTime?: string;
  individualSectionTimeLimit?: number;
  status?: "UPCOMING" | "LIVE" | "ENDED";
  batchId?: string;
}
export interface CreateAssessmentSection {
  name: string;
  marksPerQuestion: number;
  assessmentType: "CODE" | "NO_CODE";
  assessmentId: string;
}

export interface UpdateAssessmentSection {
  name?: string;
  marksPerQuestion?: number;
}

export interface CreateAssessmentQuestionBody {
  question: string;
  options: string[];
  problem?: string;
  maxMarks: number;
}
export interface UpdateAssessmentQuestionBody {
  question?: string;
  options: string[];
  maxMarks?: number;
}
