import dayjs, { Dayjs } from 'dayjs';

export interface User {
    email: string;
}

export  interface Owner {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    email: string;
    primaryPhone: string;
    secondaryPhone: string;
    referredBy: string;
    vet: string;
    vetPhone: string;
}

export interface Pet {
    name: string;
    petTypeId: number;
    petType: string;
    breedTypeIds: number[];
    breeds: string[];
    color: string;
    birthDate: Date;
    weight: string;
    sex: string;
    medicalProblems?: string;
}

export interface Appointment {
    id: number;
    companyId: number;
    userId: string;
    ownerId: number;
    owner: string;
    petId: number;
    petName: string;
    start: Dayjs,
    end: Dayjs,
    title: string;
    description?: string;
}