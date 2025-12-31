export interface JwtPayload {
  id: string;
  type: "SUPERADMIN" | "ADMIN" | "INSTITUTION" | "VENDOR" | "TEACHER";
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
  marksPerQuestion: string;
  sectionId: string;
}

export interface CourseAssignmentUpdate {
  description?: string;
  instruction?: string;
  marksPerQuestion?: string;
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
  password: string;
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
  loginPassword: string;
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
