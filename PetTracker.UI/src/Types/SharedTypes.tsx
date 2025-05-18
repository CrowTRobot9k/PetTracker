export default interface User {
    email: string;
}

export default interface Owner {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
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