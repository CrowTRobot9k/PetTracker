import { create } from "zustand";
import { convertDates } from '../Util/CommonFunctions'
const useAppointmentsStore = create((set) => ({
    loadingAppointments: false,
    appointments: [],
    loadingOwners: false,
    owners: [],

    errorMessage: null,
    showErrors: false,
    getAppointments: async () => {
        set({ showErrors: false, errorMessage: null, loadingAppointments: true });
        try {
            const response = await fetch("/api/Appointment/GetAppointments");
            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                const data = await response.json();
                data.forEach(i => {
                    convertDates(i);
                });
                set({
                    appointments: data,
                    loadingAppointments: false,
                });
            }
        } catch (e) {
            set({ showErrors: true, errorMessage: e.message, loadingAppointments: false });
        }
    },
    getOwnerList: async () => {
        set({ showErrors: false, errorMessage: null, loadingOwners: true });
        try {
            const response = await fetch("/api/Owner/GetOwnerList");
            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                const data = await response.json();
                set({
                    owners: data,
                    loadingOwners: false,
                });
            }
        } catch (e) {
            set({ showErrors: true, errorMessage: e.message, loadingOwners: false });
        }
    },
}));

export default useAppointmentsStore;