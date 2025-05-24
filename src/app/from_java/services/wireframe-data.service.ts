import { Injectable } from '@angular/core';
import { DataSchoolSetupService } from './data-school-setup.service';
import { UISchool, UISchoolList, UIStudentProfile, UIStudentProfileList } from '../models/ui.models';
import { StudentProfile } from '../models/base.model';

@Injectable({
    providedIn: 'root'
})
export class WireframeDataService {
    private static instance: WireframeDataService;
    private data!: DataSchoolSetupService;

    constructor(private dataSchoolSetup: DataSchoolSetupService) {
        if (WireframeDataService.instance) {
            return WireframeDataService.instance;
        }
        this.data = dataSchoolSetup;
        WireframeDataService.instance = this;
    }

    public static initialize(dataSchoolSetup: DataSchoolSetupService) {
        if (!WireframeDataService.instance) {
            WireframeDataService.instance = new WireframeDataService(dataSchoolSetup);
        }
    }

    public static getInstance(): WireframeDataService {
        if (!WireframeDataService.instance) {
            throw new Error('WireframeDataService must be initialized first');
        }
        return WireframeDataService.instance;
    }

    /**
     * Get a list of all schools with their UI wrapper
     */
    public schoolList(): UISchoolList {    
        const schoolList = new UISchoolList();
        for (const school of this.data.schools) {
            const uiSchool = new UISchool();
            uiSchool.school = school;
            schoolList.schools.push(uiSchool);
        }
        return schoolList;
    }

    /**
     * Get a list of student profiles for a specific school
     * @param schoolCode The business code of the school
     */
    public studentsInSchool(schoolCode: string): UIStudentProfileList {    
        const result = new UIStudentProfileList();
        for (const profile of this.data.studentProfiles) {
            if (schoolCode === profile.schoolCode) {
                const uiProfile = this.convertStudentProfile(profile);
                result.students.push(uiProfile);
            }
        }
        return result;
    }

    /**
     * Convert a student profile to a UI-ready model with all related data
     * @param profile The student profile to convert
     */
    public convertStudentProfile(profile: StudentProfile): UIStudentProfile {
        const uiProfile = new UIStudentProfile();
        uiProfile.profile = profile;
        uiProfile.student = this.data.findPersonByCode(profile.studentPersonCode);
        uiProfile.school = this.data.findSchoolByCode(profile.schoolCode);
        return uiProfile;
    }

} 