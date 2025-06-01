import { create } from "zustand";

const useAppointmentStore = create((set) => ({
    loadingPets: false,
    pets: [],

    errorMessage: null,
    showErrors: false,
    getPetList: async (ownerId?: number) => {
        set({ showErrors: false, errorMessage: null, loadingPets: true });
        try {
            const response = await fetch(`/api/Pet/GetPetList?ownerId=${ownerId ?? ''}`);
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
    }
}));

export default useAppointmentStore;