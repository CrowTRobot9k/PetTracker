import { create } from "zustand";

const usePetsStore = create((set) => ({
    loadingPets: false,
    loadingPetTypes: false,
    loadingPetPhotos: false,
    pets: [],
    petTypes: [],
    petPhotos: {}, // Store photos by petId

    errorMessage: null,
    showErrors: false,
    getPets: async (ownerId?:number) => {
        set({ showErrors: false, errorMessage: null, loadingPets: true });
        try {
            const response = await fetch(`/api/Pet/GetPets?ownerId=${ownerId ?? ''}`);
            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                const data = await response.json();
                set({
                    pets: data,
                    loadingPets: false,
                });
            }
        } catch (e) {
            set({ showErrors: true, errorMessage: e.message, loadingPets: false });
        }
    },
    getPetTypes: async () => {
        set({ showErrors: false, errorMessage: null, loadingPetTypes: true });
        try {
            const response = await fetch("/api/Pet/GetPetTypes");
            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                const data = await response.json();
                set({
                    petTypes: data,
                    loadingPetTypes: false,
                });
            }
        } catch (e) {
            set({ showErrors: true, errorMessage: e.message, loadingPetTypes: false });
        }
    },
    getPetPhotos: async (petId) => {
        set({ loadingPetPhotos: true });
        try {
            const response = await fetch(`/api/Pet/GetPetPhotos?petId=${petId}`);
            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                const data = await response.json();
                set((state) => ({
                    petPhotos: {
                        ...state.petPhotos,
                        [petId]: data
                    },
                    loadingPetPhotos: false,
                }));
                return data;
            }
        } catch (e) {
            set({ showErrors: true, errorMessage: e.message, loadingPetPhotos: false });
            return [];
        }
    },
    getPetPhotosSync: (petId) => {
        const state = usePetsStore.getState();
        return state.petPhotos[petId] || [];
    },
    updatePet: (updatedPet) => {
        set((state) => ({
            pets: state.pets.map(pet => 
                pet.id === updatedPet.id ? { ...pet, ...updatedPet } : pet
            )
        }));
    },
    getPetPhotosBatch: async (petIds) => {
        set({ loadingPetPhotos: true });
        try {
            const response = await fetch("/api/Pet/GetPetPhotosBatch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(petIds)
            });
            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                const data = await response.json();
                set((state) => ({
                    petPhotos: {
                        ...state.petPhotos,
                        ...data
                    },
                    loadingPetPhotos: false,
                }));
                return data;
            }
        } catch (e) {
            set({ showErrors: true, errorMessage: e.message, loadingPetPhotos: false });
            return {};
        }
    }
}));

export default usePetsStore;