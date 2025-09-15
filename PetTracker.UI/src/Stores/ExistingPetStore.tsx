import { create } from "zustand";

const useExistingPetsStore = create((set) => ({
    loadingExistingPets: false,  
    loadingPetPhotos: false,
    existingPets: [],
    petPhotos: {}, // Store photos by petId

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
            set({ error: e.message, loadingPetPhotos: false });
            return [];
        }
    },
    getPetPhotosSync: (petId) => {
        const state = useExistingPetsStore.getState();
        return state.petPhotos[petId] || [];
    }
}));

export default useExistingPetsStore;