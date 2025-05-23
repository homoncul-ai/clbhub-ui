import { Person, School, StudentProfile } from './base.model';

export class UISchool {
    private _school: School | null = null;

    public get school(): School | null {
        return this._school;
    }

    public set school(value: School | null) {
        this._school = value;
    }
}

export class UISchoolList {
    private _schools: UISchool[] = [];

    public get schools(): UISchool[] {
        return this._schools;
    }

    public set schools(value: UISchool[]) {
        this._schools = value;
    }
}

export class UIStudentProfile {
    private _profile: StudentProfile | null = null;
    private _student: Person | null = null;
    private _school: School | null = null;

    public get profile(): StudentProfile | null {
        return this._profile;
    }

    public set profile(value: StudentProfile | null) {
        this._profile = value;
    }

    public get student(): Person | null {
        return this._student;
    }

    public set student(value: Person | null) {
        this._student = value;
    }

    public get school(): School | null {
        return this._school;
    }

    public set school(value: School | null) {
        this._school = value;
    }
}

export class UIStudentProfileList {
    private _students: UIStudentProfile[] = [];

    public get students(): UIStudentProfile[] {
        return this._students;
    }

    public set students(value: UIStudentProfile[]) {
        this._students = value;
    }
} 