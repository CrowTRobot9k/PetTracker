import { create } from "zustand";

const useOwnersStore = create((set) => ({
    loadingOwners: false,
    loadingStates: false,
    owners: [],
    states: [],

    errorMessage: null,
    showErrors:false,
    getOwners: async () => {
        set({ showErrors: false, errorMessage: null, loadingOwners: true });
        try {
            const response = await fetch("/api/Owner/GetOwners");
            if (!response.ok)
            {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                const data = await response.json();
                set({
                    owners: data,
                    loadingOwners: false,
                });
            }
        } catch (e)
        {
            set({ showErrors:true,errorMessage: e.message, loadingOwners: false });
        }
    },
    getStates: async () => {
        set({ showErrors: false, errorMessage: null, loadingStates: true });
        try {
            const response = await fetch("/api/Owner/GetStates");
            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                const data = await response.json();
                set({
                    states: data,
                    loadingStates: false,
                });
            }
        } catch (e) {
            set({ showErrors: true, errorMessage: e.message, loadingStates: false });
        }
    }
}));

export default useOwnersStore;