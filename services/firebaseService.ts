import { AppDatabase, User, Class, Role, StudentUser, StudentData, TestAttempt } from '../types';

// IMPORTANT: This now uses a relative path. The server will handle routing '/api' requests.
const API_BASE_URL = '/api';

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Server error');
    }
    return response.json() as Promise<T>;
};

// --- AUTHENTICATION API ---

export const login = async (usernameOrEmail: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password })
    });
    if (!response.ok) {
        logout(); // Clear any previous session
        return null;
    }
    const user = await response.json();
    // In a real app, we'd store a session token (JWT)
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  } catch (e) {
      console.error("Login failed:", e);
      logout();
      return null;
  }
};

export const logout = async (): Promise<void> => {
    sessionStorage.removeItem('currentUser');
};

export const getCurrentUser = async (): Promise<User | null> => {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}


// --- USER MANAGEMENT API ---

export const getUsers = async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return handleResponse<User[]>(response);
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return handleResponse<User>(response);
};

export const updateUser = async(userId: string, updates: Partial<StudentUser>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    return handleResponse<User>(response);
};

export const createStudentAndAddToClass = async (
    studentData: Omit<StudentUser, 'id' | 'role' | 'locked'>,
    classId: string
): Promise<{ newUser: StudentUser, updatedClass: Class }> => {
    const response = await fetch(`${API_BASE_URL}/create-student-and-add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentData, classId })
    });
    return handleResponse<{ newUser: StudentUser, updatedClass: Class }>(response);
}


// --- CLASS MANAGEMENT API ---

export const getClassesForTeacher = async (teacherId: string): Promise<Class[]> => {
    const response = await fetch(`${API_BASE_URL}/teacher/${teacherId}/classes`);
    return handleResponse<Class[]>(response);
};

export const createClass = async (name: string, teacherId: string): Promise<Class> => {
    const response = await fetch(`${API_BASE_URL}/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, teacherId })
    });
    return handleResponse<Class>(response);
}

export const addStudentToClass = async (classId: string, studentId: string): Promise<Class> => {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/students`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
    });
    return handleResponse<Class>(response);
}

// --- STUDENT DATA API ---

export const getStudentProfile = async (studentId: string): Promise<StudentData> => {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/profile`);
    return handleResponse<StudentData>(response);
}

export const updateStudentProfileAfterTest = async (studentId: string, attempt: TestAttempt): Promise<StudentData> => {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/profile/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attempt })
    });
    return handleResponse<StudentData>(response);
}

// --- LEVEL PARAMS API ---
export const getLevelParams = async (): Promise<{ levelParamsInt: number[][], levelParamsFrac: number[][] }> => {
    const response = await fetch(`${API_BASE_URL}/level-params`);
    return handleResponse<{ levelParamsInt: number[][], levelParamsFrac: number[][] }>(response);
};

export const updateLevelParams = async (params: { levelParamsInt?: number[][], levelParamsFrac?: number[][] }): Promise<void> => {
    await fetch(`${API_BASE_URL}/level-params`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    });
}