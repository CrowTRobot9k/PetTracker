import { create } from "zustand";

const useExistingPetsStore = create((set) => ({
    loadingExistingPets: false,  
    existingPets: [],

    error: null,  
    getExistingPets: async (ownerId: number) => {
        set({ loadingPets: true });
        try {
            const response = await fetch(`/api/Pet/GetPets`);
            if (response.status == 200) {
                const data = await response.json();
                set({
                    existingPets: data.filter(f => f.ownerId != ownerId),
                    loadingExistingPets: false,
                });
            }
        } catch (error) {
            set({ error: "Failed to fetch Pet Types", loadingPets: false });
        }
    }
}));

export default useExistingPetsStore;