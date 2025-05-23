import { Address } from '../models/base.model';
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

    public schools: School[] = [];
    public students: Person[] = [];
    public educators: Person[] = [];
    public eduAdvocates: Person[] = [];
    public eduBrokers: Person[] = [];
    public eduProviders: Person[] = [];
    public studentProfiles: StudentProfile[] = [];
    public eduAdvocateProfiles: GuidanceProfile[] = [];
    public eduBrokerProfiles: BrokerProfile[] = [];
    public eduProviderProfiles: ProviderProfile[] = [];

    constructor(private http: HttpClient) {
        if (DataSchoolSetupService.instance) {
            return DataSchoolSetupService.instance;
        }
        DataSchoolSetupService.instance = this;
        console.log('[DataSchoolSetupService constructor] Instance created.');
    }

    public static getInstance(): DataSchoolSetupService {
        if (!DataSchoolSetupService.instance) {
            throw new Error('DataSchoolSetupService must be initialized first');
        }
        return DataSchoolSetupService.instance;
    }

    public async loadFromYaml(): Promise<void> {
        try {
            console.log('[DataSchoolSetupService] Starting YAML data load...');
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
            console.log('[DataSchoolSetupService] YAML data load complete!');
            console.log(`[DataSchoolSetupService] Schools: ${this.schools.length}`);
            console.log(`[DataSchoolSetupService] Students: ${this.students.length}`);
            console.log(`[DataSchoolSetupService] Educators: ${this.educators.length}`);
            console.log(`[DataSchoolSetupService] EduAdvocates: ${this.eduAdvocates.length}`);
            console.log(`[DataSchoolSetupService] EduBrokers: ${this.eduBrokers.length}`);
            console.log(`[DataSchoolSetupService] EduProviders: ${this.eduProviders.length}`);
            console.log(`[DataSchoolSetupService] StudentProfiles: ${this.studentProfiles.length}`);
            console.log(`[DataSchoolSetupService] EduAdvocateProfiles: ${this.eduAdvocateProfiles.length}`);
            console.log(`[DataSchoolSetupService] EduBrokerProfiles: ${this.eduBrokerProfiles.length}`);
            console.log(`[DataSchoolSetupService] EduProviderProfiles: ${this.eduProviderProfiles.length}`);
        } catch (error) {
            console.error('Error loading YAML data:', error);
            throw error;
        }
    }

    private async loadSchools(): Promise<void> {
        console.log('[DataSchoolSetupService] Loading schools...');
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.schools.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { schools: School[] };
        this.schools = data.schools;
        this.prepare(this.schools);
        console.log(`[DataSchoolSetupService] Loaded ${this.schools.length} schools.`);
    }

    private async loadStudents(): Promise<void> {
        console.log('[DataSchoolSetupService] Loading students...');
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.students.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { students: Person[] };
        this.students = data.students;
        this.prepare(this.students);
        console.log(`[DataSchoolSetupService] Loaded ${this.students.length} students.`);
    }

    private async loadEducators(): Promise<void> {
        console.log('[DataSchoolSetupService] Loading educators...');
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.eduCators.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { eduCators: Person[] };
        this.educators = data.eduCators;
        this.prepare(this.educators);
        console.log(`[DataSchoolSetupService] Loaded ${this.educators.length} educators.`);
    }

    private async loadEduAdvocates(): Promise<void> {
        console.log('[DataSchoolSetupService] Loading eduAdvocates...');
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.eduAdvocate.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { eduAdvocate: Person[] };
        this.eduAdvocates = data.eduAdvocate;
        this.prepare(this.eduAdvocates);
        console.log(`[DataSchoolSetupService] Loaded ${this.eduAdvocates.length} eduAdvocates.`);
    }

    private async loadEduBrokers(): Promise<void> {
        console.log('[DataSchoolSetupService] Loading eduBrokers...');
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.eduBroker.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { eduBroker: Person[] };
        this.eduBrokers = data.eduBroker;
        this.prepare(this.eduBrokers);
        console.log(`[DataSchoolSetupService] Loaded ${this.eduBrokers.length} eduBrokers.`);
    }

    private async loadEduProviders(): Promise<void> {
        console.log('[DataSchoolSetupService] Loading eduProviders...');
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.eduProvider.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { eduProvider: Person[] };
        this.eduProviders = data.eduProvider;
        this.prepare(this.eduProviders);
        console.log(`[DataSchoolSetupService] Loaded ${this.eduProviders.length} eduProviders.`);
    }

    private async loadStudentProfiles(): Promise<void> {
        console.log('[DataSchoolSetupService] Loading studentProfiles...');
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.studentProfiles.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { studentProfiles: StudentProfile[] };
        this.studentProfiles = data.studentProfiles;
        this.prepare(this.studentProfiles);
        console.log(`[DataSchoolSetupService] Loaded ${this.studentProfiles.length} studentProfiles.`);
    }

    private async loadEduAdvocateProfiles(): Promise<void> {
        console.log('[DataSchoolSetupService] Loading eduAdvocateProfiles...');
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.eduAdvocateProfiles.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { eduAdvocateProfiles: GuidanceProfile[] };
        this.eduAdvocateProfiles = data.eduAdvocateProfiles;
        this.prepare(this.eduAdvocateProfiles);
        console.log(`[DataSchoolSetupService] Loaded ${this.eduAdvocateProfiles.length} eduAdvocateProfiles.`);
    }

    private async loadEduBrokerProfiles(): Promise<void> {
        console.log('[DataSchoolSetupService] Loading eduBrokerProfiles...');
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.eduBrokerProfiles.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { eduBrokerProfiles: BrokerProfile[] };
        this.eduBrokerProfiles = data.eduBrokerProfiles;
        this.prepare(this.eduBrokerProfiles);
        console.log(`[DataSchoolSetupService] Loaded ${this.eduBrokerProfiles.length} eduBrokerProfiles.`);
    }

    private async loadEduProviderProfiles(): Promise<void> {
        console.log('[DataSchoolSetupService] Loading eduProviderProfiles...');
        const response = await this.http.get(`${this.basePath}/DataSchoolSetup.eduProviderProfiles.yaml`, { responseType: 'text' }).toPromise();
        const data = yaml.load(response as string) as { eduProviderProfiles: ProviderProfile[] };
        this.eduProviderProfiles = data.eduProviderProfiles;
        this.prepare(this.eduProviderProfiles);
        console.log(`[DataSchoolSetupService] Loaded ${this.eduProviderProfiles.length} eduProviderProfiles.`);
    }

    public findPersonByCode(code: string): Person | null {
        return this.students.find(student => student.emailAddress === code) || null;
    }

    public findSchoolByCode(code: string): School | null{
        let xx = this.schools.find(school => school.businessCode === code) || null;
        return xx;
    }

    private prepare(items: any[]): void {
        // Implementation of prepare method
    }
}