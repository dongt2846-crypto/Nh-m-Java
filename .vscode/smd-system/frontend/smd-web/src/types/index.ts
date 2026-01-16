export interface SyllabusCreateDTO {
  courseCode: string;
  courseName: string;
  description?: string;
  objectives?: string;
  prerequisites?: string;
  assessmentMethods?: string;
  textbooks?: string;
  references?: string;
  credits?: number;
  semester?: string;
  academicYear?: string;
}

export interface SyllabusUpdateDTO extends Partial<SyllabusCreateDTO> {}

export interface UserCreateDTO {
  username: string;
  email: string;
  fullName: string;
  password: string;
  roles?: string[];
  active?: boolean;
}

export interface UserUpdateDTO extends Partial<UserCreateDTO> {}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roles?: string[];
}
