import dayjs, { Dayjs } from 'dayjs';

export default interface User {
    email: string;
}

export default interface Owner {
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

export default interface Pet {
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

export default interface Appointment {
    id: number;
    ownerId: number;
    owner: string;
    petId: number;
    petName: string;
    start: Dayjs,
    end: Dayjs,
    title: string;
    description?: string;
}