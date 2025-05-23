export interface BaseModel {
    prepare(): void;
}

export interface Address {
    addressDisplayName: string;
    streetNumber: string;
    addressLine1: string;
    city: string;
    stateCode: string;
    postalCode: string;
    countryCode: string;
}

export interface Person extends BaseModel {
    firstName: string;
    lastName: string;
    emailAddress: string;
    birthYear: number;
    birthMonth: number;
    jobTitle: string;
    phoneNumber: string;
    phoneCanReceiveText: boolean;
    phoneAltNumber: string;
    phoneAltCanReceiveText: boolean;
}

export interface School extends BaseModel {
    name: string;
    businessCode: string;
    description: string;
    available: boolean;
    address: Address;
}

export interface StudentProfile extends BaseModel {
    schoolCode: string;
    studentPersonCode: string;
    advocateCode?: string;
    onboardInterestsText: string;
    onboardNeedsText: string;
    graduationYear: number;
}

export interface GuidanceProfile extends BaseModel {
    schoolCode: string;
    personCode: string;
    shortDescrip: string;
}

export interface BrokerProfile extends BaseModel {
    schoolCode: string;
    personCode: string;
    shortDescrip: string;
}

export interface ProviderProfile extends BaseModel {
    schoolCode: string;
    personCode: string;
    shortDescrip: string;
} 