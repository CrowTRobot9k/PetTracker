import { create } from "zustand";

//TODO: put in specific stores.
const useSharedStore = create((set) => ({
    loggedInUser: {},
    loadingPets: false,
    loadingPetTypes: false,
    loadingPetBreeds: false,
    pets: [],
    petTypes: [],
    petBreeds:[],

    error:null,
    getPets: async () => {
        set({ loadingPets: true });
        try {
            const response = await fetch("/api/Pet/GetPets");
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
    getPetTypes: async () =>
    {
        set({ loadingPetTypes: true });
        try {
            const response = await fetch("/api/Pet/GetPetTypes");
            if (response.status == 200)
            {
                const data = await response.json();
                set({
                    petTypes: data,
                    loadingPetTypes: false,
                });
            }
        } catch (error) {
            set({ error: "Failed to fetch Pet Types", loadingPetTypes: false });
        }
    },
    getPetBreeds: async (petTypeId: number) =>
    {
        set({ loadingPetBreeds: true });
        try {
            const response = await fetch(`/api/Pet/GetPetBreeds?petTypeId=${petTypeId}`);
            if (response.status == 200) {
                const data = await response.json();
                set({
                    petBreeds: data,
                    loadingPetBreeds: false,
                });
            }
        } catch (error) {
            set({ error: "Failed to fetch Pet Types", loadingPetBreeds: false });
        }
    }
}));

export default useSharedStore;