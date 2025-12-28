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
