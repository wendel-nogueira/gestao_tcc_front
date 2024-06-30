export interface User {
  id?: string;
  email: string;
  role: string | Role;
  password?: string;
  userInfo?: Info;
}

export interface Info {
  id?: string;
  authId: string;
  name: string;
  cpf: string;
  birthDate: string;
  sex: string;
  role?: string;
  isActive?: boolean;
  student?: Student;
  teacher?: Teacher;
  external?: External;
}

export interface Student {
  registration: string;
  course: string;
  admissionDate: string;
  graduationDate: string;
}

export interface Teacher {
  siape: string;
  area: string;
}

export interface External {
  institution: string;
  formation: string;
  area: string;
}

export interface Role {
  id: string;
  name: string;
  normalizedName: string;
}
