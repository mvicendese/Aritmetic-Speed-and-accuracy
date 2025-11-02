import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { nanoid } from 'nanoid';

// --- Default Data (from frontend constants) ---
const DEFAULT_LEVEL_PARAMS_INT = [
    [0.6, 0.8, 0.95, 0, 15, 0, 9, 1, 6, 1, 5, 2], [0.4, 0.75, 0.95, 0, 15, 0, 10, 1, 9, 1, 5, 2],
    [0.4, 0.7, 0.9, 0, 20, 0, 12, 1, 9, 1, 5, 2], [0.35, 0.6, 0.8, 0, 20, 0, 15, 1, 12, 1, 6, 1],
    [0.25, 0.5, 0.75, 0, 25, 0, 15, 1, 12, 1, 6, 1], [0.6, 0.8, 0.95, -25, 25, -12, 12, -9, 9, -6, 6, 1],
    [0.45, 0.75, 0.95, -25, 25, -12, 12, -9, 9, -7, 7, 1], [0.4, 0.7, 0.9, -35, 35, -20, 20, -12, 12, -8, 8, 1],
    [0.35, 0.6, 0.8, -40, 40, -25, 25, -12, 12, -9, 9, 1], [0.25, 0.5, 0.75, -45, 45, -25, 25, -15, 15, -9, 9, 1],
    [0.25, 0.5, 0.75, -50, 50, -30, 30, -15, 15, -12, 12, 1], [0.25, 0.5, 0.75, -50, 50, -30, 30, -15, 15, -12, 12, 1],
    [0.25, 0.5, 0.75, -55, 55, -35, 35, -15, 15, -12, 12, 1], [0.25, 0.5, 0.75, -55, 55, -35, 35, -15, 15, -12, 12, 1],
    [0.25, 0.5, 0.75, -60, 60, -40, 40, -15, 15, -12, 12, 1], [0.25, 0.5, 0.75, -60, 60, -40, 40, -15, 15, -12, 12, 1],
    [0.25, 0.5, 0.75, -65, 65, -55, 55, -15, 15, -12, 12, 1], [0.25, 0.5, 0.75, -70, 70, -60, 60, -20, 20, -15, 15, 1],
    [0.25, 0.5, 0.75, -70, 70, -60, 60, -20, 20, -15, 15, 1], [0.25, 0.5, 0.75, -75, 75, -65, 65, -20, 20, -15, 15, 1],
];
const DEFAULT_LEVEL_PARAMS_FRAC = [
    [0.8, 0.15, 0.3, 0.8, 5], [0.8, 0.20, 0.35, 0.75, 5], [0.75, 0.20, 0.35, 0.75, 6],
    [0.75, 0.25, 0.5, 0.75, 6], [0.7, 0.25, 0.5, 0.75, 7], [0.7, 0.25, 0.5, 0.75, 8],
    [0.65, 0.25, 0.5, 0.75, 9], [0.65, 0.3, 0.6, 0.8, 10], [0.6, 0.3, 0.6, 0.8, 12],
    [0.6, 0.35, 0.7, 0.8, 15],
];
const defaultStudentData = {
  currentLevel: 1,
  history: [],
  consecutiveFastTrackCount: 0,
};

// --- Database Setup ---
const defaultData = {
  users: [
    {
      id: 'admin-01',
      firstName: 'Admin',
      surname: 'User',
      email: 'admin@sprint.com',
      password: 'admin',
      role: 'admin',
    },
  ],
  classes: [],
  studentProfiles: {},
  levelParamsInt: DEFAULT_LEVEL_PARAMS_INT,
  levelParamsFrac: DEFAULT_LEVEL_PARAMS_FRAC,
};

const adapter = new JSONFile('db.json');
const db = new Low(adapter, defaultData);
await db.read(); // Reads db.json, creating it if it doesn't exist
db.data = db.data || defaultData; // Ensure db.data is not null
await db.write();

// --- Express App Setup ---
const app = express();
app.use(cors()); // Allow requests from the frontend
app.use(express.json()); // Parse JSON bodies

const PORT = 3001;

// --- API Endpoints ---

// POST /login
app.post('/login', (req, res) => {
    const { usernameOrEmail, password } = req.body;
    const formattedInput = usernameOrEmail.toLowerCase().replace('.', '');

    const user = db.data.users.find(u => {
        if (u.email && u.email.toLowerCase() === usernameOrEmail.toLowerCase()) {
            return true;
        }
        if (u.role === 'student') {
            const studentUsername = `${u.firstName.toLowerCase()}${u.surname.toLowerCase()}`;
            return studentUsername === formattedInput;
        }
        return false;
    });

    if (user && user.password === password) {
        res.json(user);
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// GET /users
app.get('/users', (req, res) => {
    res.json(db.data.users);
});

// POST /users
app.post('/users', async (req, res) => {
    const userData = req.body;
    const newUser = { ...userData, id: `user-${nanoid(8)}` };
    db.data.users.push(newUser);

    if (newUser.role === 'student') {
        db.data.studentProfiles[newUser.id] = { ...defaultStudentData };
    }

    await db.write();
    res.status(201).json(newUser);
});

// PUT /users/:id
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const userIndex = db.data.users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    db.data.users[userIndex] = { ...db.data.users[userIndex], ...updates };
    await db.write();
    res.json(db.data.users[userIndex]);
});

// GET /teacher/:teacherId/classes
app.get('/teacher/:teacherId/classes', (req, res) => {
    const { teacherId } = req.params;
    const classes = db.data.classes.filter(c => c.teacherIds.includes(teacherId));
    res.json(classes);
});

// POST /classes
app.post('/classes', async (req, res) => {
    const { name, teacherId } = req.body;
    const newClass = {
        id: `class-${nanoid(8)}`,
        name,
        teacherIds: [teacherId],
        studentIds: [],
    };
    db.data.classes.push(newClass);
    await db.write();
    res.status(201).json(newClass);
});

// PUT /classes/:classId/students
app.put('/classes/:classId/students', async (req, res) => {
    const { classId } = req.params;
    const { studentId } = req.body;
    const classIndex = db.data.classes.findIndex(c => c.id === classId);

    if (classIndex === -1) {
        return res.status(404).json({ message: 'Class not found' });
    }
    if (!db.data.classes[classIndex].studentIds.includes(studentId)) {
        db.data.classes[classIndex].studentIds.push(studentId);
    }

    await db.write();
    res.json(db.data.classes[classIndex]);
});

// POST /create-student-and-add
app.post('/create-student-and-add', async (req, res) => {
    const { studentData, classId } = req.body;
    
    // Create student
    const newStudent = {
        ...studentData,
        id: `user-${nanoid(8)}`,
        role: 'student',
        locked: false,
    };
    db.data.users.push(newStudent);
    db.data.studentProfiles[newStudent.id] = { ...defaultStudentData };

    // Add to class
    const classIndex = db.data.classes.findIndex(c => c.id === classId);
     if (classIndex === -1) {
        return res.status(404).json({ message: 'Class not found' });
    }
    db.data.classes[classIndex].studentIds.push(newStudent.id);

    await db.write();
    res.status(201).json({ newUser: newStudent, updatedClass: db.data.classes[classIndex] });
});

// GET /students/:studentId/profile
app.get('/students/:studentId/profile', (req, res) => {
    const { studentId } = req.params;
    const profile = db.data.studentProfiles[studentId] || { ...defaultStudentData };
    res.json(profile);
});

// POST /students/:studentId/profile/test
app.post('/students/:studentId/profile/test', async (req, res) => {
    const { studentId } = req.params;
    const { attempt } = req.body;

    const studentData = db.data.studentProfiles[studentId] || { ...defaultStudentData };

    let newLevel = studentData.currentLevel;
    let newConsecutiveCount = studentData.consecutiveFastTrackCount;
    
    if (attempt.correctCount > 22) {
        if (attempt.timeRemaining > 60) newLevel += 2;
        else if (attempt.timeRemaining > 20) newLevel += 1;
        newConsecutiveCount = 0;
    } else if (attempt.correctCount >= 20 && attempt.timeRemaining < 20) {
        newConsecutiveCount += 1;
        if (newConsecutiveCount >= 3) {
            newLevel += 1;
            newConsecutiveCount = 0;
        }
    } else {
        newConsecutiveCount = 0;
    }
    
    newLevel = Math.min(newLevel, 20);
    newLevel = Math.max(newLevel, 1);

    const newStudentData = {
      currentLevel: newLevel,
      history: [...studentData.history, attempt],
      consecutiveFastTrackCount: newConsecutiveCount,
    };

    db.data.studentProfiles[studentId] = newStudentData;
    await db.write();
    res.json(newStudentData);
});

// GET /level-params
app.get('/level-params', (req, res) => {
    res.json({
        levelParamsInt: db.data.levelParamsInt,
        levelParamsFrac: db.data.levelParamsFrac,
    });
});

// PUT /level-params
app.put('/level-params', async (req, res) => {
    const { levelParamsInt, levelParamsFrac } = req.body;
    if (levelParamsInt) db.data.levelParamsInt = levelParamsInt;
    if (levelParamsFrac) db.data.levelParamsFrac = levelParamsFrac;
    await db.write();
    res.status(200).json({ message: 'Parameters updated' });
});


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
