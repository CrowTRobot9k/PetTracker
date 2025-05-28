import { create } from "zustand";

const useOwnersStore = create((set) => ({
    loadingOwners: false,
    loadingStates: false,
    owners: [],
    states: [],

    error: null,
    getOwners: async () => {
        set({ loadingOwners: true });
        try {
            const response = await fetch("/api/Owner/GetOwners");
            if (!response.ok)
            {
                throw new Error(await response.text());
            }

            if (response.status == 200) {
                const data = await response.json();
                set({
                    owners: data,
                    loadingOwners: false,
                });
            }
        } catch (e) {
            set({ error: e, loadingOwners: false });
        }
    },
    getStates: async () => {
        set({ loadingOwnerTypes: true });
        try {
            const response = await fetch("/api/Owner/GetStates");
            if (response.status == 200) {
                const data = await response.json();
                set({
                    states: data,
                    loadingStates: false,
                });
            }
        } catch (error) {
            set({ error: "Failed to fetch States", loadingStates: false });
        }
    }
}));

export default useOwnersStore;