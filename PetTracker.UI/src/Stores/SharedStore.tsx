import { create } from "zustand";

//TODO: put in specific stores.
const useSharedStore = create((set) => ({
    loggedInUser: {},
    loadingPetTypes: false,
    petTypes: [],

    error:null,
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
            const response = await fetch(`/api/Pet/GetPetBreeds?id${petTypeId}`);
            set({
                petBreeds: response,
                loadingPetBreeds: false,
            });
        } catch (error) {
            set({ error: "Failed to fetch Pet Types", loadingPetBreeds: false });
        }
    }
}));

export default useSharedStore;