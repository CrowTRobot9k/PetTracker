import { create } from "zustand";

const usePetStore = create((set) => ({
    loadingPetTypes: false,
    loadingPetBreeds: false,
    petTypes: [],
    petBreeds: [],

    errorMessage: null,
    showErrors: false,
    //getPetTypes: async () => {
    //    set({ loadingPetTypes: true });
    //    try {
    //        const response = await fetch("/api/Pet/GetPetTypes");
    //        if (response.status == 200) {
    //            const data = await response.json();
    //            set({
    //                petTypes: data,
    //                loadingPetTypes: false,
    //            });
    //        }
    //    } catch (error) {
    //        set({ error: "Failed to fetch Pet Types", loadingPetTypes: false });
    //    }
    //},
    getPetBreeds: async (petTypeId: number) => {
        set({ showErrors: false, errorMessage: null, loadingPetBreeds: true });
        try {
            const response = await fetch(`/api/Pet/GetPetBreeds?petTypeId=${petTypeId}`);
            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                const data = await response.json();
                set({
                    petBreeds: data,
                    loadingPetBreeds: false,
                });
            }
        } catch (e) {
            set({ showErrors: true, errorMessage: e.message, loadingPetBreeds: false });
        }
    }
}));

export default usePetStore;