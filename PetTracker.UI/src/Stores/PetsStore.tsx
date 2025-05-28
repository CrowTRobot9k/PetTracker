import { create } from "zustand";

const usePetsStore = create((set) => ({
    loadingPets: false,
    loadingPetTypes: false,
    pets: [],
    petTypes: [],

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
    }
}));

export default usePetsStore;