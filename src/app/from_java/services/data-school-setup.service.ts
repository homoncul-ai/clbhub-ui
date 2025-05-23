import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as yaml from 'js-yaml';

import {
    Person,
    School,
    StudentProfile,
    GuidanceProfile,
    BrokerProfile,
    ProviderProfile
} from '../models/base.model';

@Injectable({
    providedIn: 'root'
})
export class DataSchoolSetupService {
    private static instance: DataSchoolSetupService;
    private basePath = 'assets/data_from_java';

    private schools: School[] = [];
    private students: Person[] = [];
    private educators: Person[] = [];
    private eduAdvocates: Person[] = [];
    private eduBrokers: Person[] = [];
    private eduProviders: Person[] = [];
    private studentProfiles: StudentProfile[] = [];
    private eduAdvocateProfiles: GuidanceProfile[] = [];
    private eduBrokerProfiles: BrokerProfile[] = [];
    private eduProviderProfiles: ProviderProfile[] = [];

    constructor(private http: HttpClient) {
        if (DataSchoolSetupService.instance) {
            return DataSchoolSetupService.instance;
        }
        DataSchoolSetupService.instance = this;
    }

    public static getInstance(): DataSchoolSetupService {
        if (!DataSchoolSetupService.instance) {
            throw new Error('DataSchoolSetupService must be initialized first');
        }
        return DataSchoolSetupService.instance;
    }

    public async loadFromYaml(): Promise<void> {
        try {
            await Promise.all([
                this.loadSchools(),
                this.loadStudents(),
                this.loadEducators(),
                this.loadEduAdvocates(),
                this.loadEduBrokers(),
                this.loadEduProviders(),
                this.loadStudentProfiles(),
                this.loadEduAdvocateProfiles(),
                this.loadEduBrokerProfiles(),
                this.loadEduProviderProfiles()
            ]);
        } catch (error) {
            console.error('Error loading YAML data:', error);
            throw error;
        }
    }

    private async loadSchools(): Promise<void> {
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.schools.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { schools: School[] };
        this.schools = data.schools;
        this.prepare(this.schools);
    }

    private async loadStudents(): Promise<void> {
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.students.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { students: Person[] };
        this.students = data.students;
        this.prepare(this.students);
    }

    private async loadEducators(): Promise<void> {
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.eduCators.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { eduCators: Person[] };
        this.educators = data.eduCators;
        this.prepare(this.educators);
    }

    private async loadEduAdvocates(): Promise<void> {
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.eduAdvocate.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { eduAdvocate: Person[] };
        this.eduAdvocates = data.eduAdvocate;
        this.prepare(this.eduAdvocates);
    }

    private async loadEduBrokers(): Promise<void> {
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.eduBrokers.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { eduBrokers: Person[] };
        this.eduBrokers = data.eduBrokers;
        this.prepare(this.eduBrokers);
    }

    private async loadEduProviders(): Promise<void> {
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.eduProvider.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { eduProvider: Person[] };
        this.eduProviders = data.eduProvider;
        this.prepare(this.eduProviders);
    }

    private async loadStudentProfiles(): Promise<void> {
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.studentProfiles.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { studentProfiles: StudentProfile[] };
        this.studentProfiles = data.studentProfiles;
        this.prepare(this.studentProfiles);
    }

    private async loadEduAdvocateProfiles(): Promise<void> {
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.eduAdvocateProfile.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { eduAdvocateProfile: GuidanceProfile[] };
        this.eduAdvocateProfiles = data.eduAdvocateProfile;
        this.prepare(this.eduAdvocateProfiles);
    }

    private async loadEduBrokerProfiles(): Promise<void> {
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.eduBrokerProfiles.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { eduBrokerProfiles: BrokerProfile[] };
        this.eduBrokerProfiles = data.eduBrokerProfiles;
        this.prepare(this.eduBrokerProfiles);
    }

    private async loadEduProviderProfiles(): Promise<void> {
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.eduProviderProfiles.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { eduProviderProfiles: ProviderProfile[] };
        this.eduProviderProfiles = data.eduProviderProfiles;
        this.prepare(this.eduProviderProfiles);
    }

    private prepare<T extends { prepare(): void }>(items: T[]): void {
        for (const item of items) {
            item.prepare();
        }
    }

    // Getters
    public getSchools(): School[] {
        return this.schools;
    }

    public getStudents(): Person[] {
        return this.students;
    }

    public getEducators(): Person[] {
        return this.educators;
    }

    public getEduAdvocates(): Person[] {
        return this.eduAdvocates;
    }

    public getEduBrokers(): Person[] {
        return this.eduBrokers;
    }

    public getEduProviders(): Person[] {
        return this.eduProviders;
    }

    public getStudentProfiles(): StudentProfile[] {
        return this.studentProfiles;
    }

    public getEduAdvocateProfiles(): GuidanceProfile[] {
        return this.eduAdvocateProfiles;
    }

    public getEduBrokerProfiles(): BrokerProfile[] {
        return this.eduBrokerProfiles;
    }

    public getEduProviderProfiles(): ProviderProfile[] {
        return this.eduProviderProfiles;
    }

    // Utility methods
    public findPersonByCode(personCode: string | null): Person | null {
        if (!personCode) return null;

        const allPeople = [
            ...this.students,
            ...this.educators,
            ...this.eduAdvocates,
            ...this.eduBrokers,
            ...this.eduProviders
        ];

        return allPeople.find(person => person.emailAddress === personCode) || null;
    }

    public findSchoolByCode(schoolCode: string | null): School | null {
        if (!schoolCode) return null;
        return this.schools.find(school => school.businessCode === schoolCode) || null;
    }

    public newStudentProfile(
        schoolCode: string,
        personCode: string,
        shortText: string
    ): StudentProfile | null {
        if (!schoolCode || !personCode || !shortText) {
            return null;
        }

        const school = this.findSchoolByCode(schoolCode);
        if (!school) {
            return null;
        }

        const person = this.findPersonByCode(personCode);
        if (!person) {
            return null;
        }

        const profile: StudentProfile = {
            schoolCode,
            studentPersonCode: personCode,
            onboardInterestsText: shortText,
            onboardNeedsText: 'Student needs guidance and opportunities in their area of interest.',
            graduationYear: 2028,
            prepare: () => {}
        };

        this.studentProfiles.push(profile);
        return profile;
    }
} 