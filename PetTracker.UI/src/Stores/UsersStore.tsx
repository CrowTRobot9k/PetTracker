import { create } from "zustand";

const useUsersStore = create((set) => ({
    loadingUsers: false,
    users: [],
    loadingRoles: false,
    roles: [],
    loadingCompanies: false,
    companies: [],

    errorMessage: null,
    showErrors: false,
    getUsers: async (companyId?: number) => {
        set({ showErrors: false, errorMessage: null, loadingUsers: true });
        try {
            const response = await fetch(`/api/User/GetUsers?companyId=${companyId}`);
            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                const data = await response.json();
                set({
                    users: data,
                    loadingUsers: false,
                });
            }
        } catch (e) {
            set({ showErrors: true, errorMessage: e.message, loadingUsers: false });
        }
    },
    getRoles: async () => {
        set({ showErrors: false, errorMessage: null, loadingRoles: true });
        try {
            const response = await fetch("/api/User/GetRoles");
            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                const data = await response.json();
                set({
                    roles: data,
                    loadingRoles: false,
                });
            }
        } catch (e) {
            set({ showErrors: true, errorMessage: e.message, loadingRoles: false });
        }
    },
    getCompanies: async () => {
        set({ showErrors: false, errorMessage: null, loadingCompanies: true });
        try {
            const response = await fetch("/api/Company/GetCompanies");
            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                const data = await response.json();
                set({
                    companies: data,
                    loadingCompanies: false,
                });
            }
        } catch (e) {
            set({ showErrors: true, errorMessage: e.message, loadingCompanies: false });
        }
    }
}));

export default useUsersStore;