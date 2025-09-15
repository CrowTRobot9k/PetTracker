import { create } from "zustand";

const useOwnersStore = create((set) => ({
    loadingOwners: false,
    loadingStates: false,
    loadingOwnerPhotos: false,
    owners: [],
    states: [],
    ownerPhotos: {}, // Store photos by ownerId

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
    },
    getOwnerPhotos: async (ownerId) => {
        set({ loadingOwnerPhotos: true });
        try {
            const response = await fetch(`/api/Owner/GetOwnerPhotos?ownerId=${ownerId}`);
            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                const data = await response.json();
                set((state) => ({
                    ownerPhotos: {
                        ...state.ownerPhotos,
                        [ownerId]: data
                    },
                    loadingOwnerPhotos: false,
                }));
                return data;
            }
        } catch (e) {
            set({ showErrors: true, errorMessage: e.message, loadingOwnerPhotos: false });
            return [];
        }
    },
    getOwnerPhotosSync: (ownerId) => {
        const state = useOwnersStore.getState();
        return state.ownerPhotos[ownerId] || [];
    }
}));

export default useOwnersStore;