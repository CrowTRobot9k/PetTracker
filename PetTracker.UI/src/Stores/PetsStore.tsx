import { create } from "zustand";

const usePetsStore = create((set) => ({
    loadingPets: false,
    loadingPetTypes: false,
    pets: [],
    petTypes: [],

    error: null,
    getPets: async (ownerId?:number) => {
        set({ loadingPets: true });
        try {
            const response = await fetch(`/api/Pet/GetPets?ownerId=${ownerId??''}`);
            if (response.status == 200) {
                const data = await response.json();
                set({
                    pets: data,
                    loadingPets: false,
                });
            }
        } catch (error) {
            set({ error: "Failed to fetch Pet Types", loadingPets: false });
        }
    },
    getPetTypes: async () => {
        set({ loadingPetTypes: true });
        try {
            const response = await fetch("/api/Pet/GetPetTypes");
            if (response.status == 200) {
                const data = await response.json();
                set({
                    petTypes: data,
                    loadingPetTypes: false,
                });
            }
        } catch (error) {
            set({ error: "Failed to fetch Pet Types", loadingPetTypes: false });
        }
    }
}));

export default usePetsStore;