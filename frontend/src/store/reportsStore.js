import { defineStore } from "pinia";
import { ref } from "vue";

export const useReportsStore = defineStore("reports", () => {
  // Estado
  const reports = ref([]);
  const selectedReport = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Acciones
  const setReports = (newReports) => {
    reports.value = newReports;
  };

  const addReport = (report) => {
    reports.value.push(report);
  };

  const selectReport = (report) => {
    selectedReport.value = report;
  };

  const clearSelectedReport = () => {
    selectedReport.value = null;
  };

  const deleteReport = (reportId) => {
    reports.value = reports.value.filter((r) => r.id !== reportId);
  };

  const updateReport = (reportId, updatedData) => {
    const report = reports.value.find((r) => r.id === reportId);
    if (report) {
      Object.assign(report, updatedData);
    }
  };

  return {
    reports,
    selectedReport,
    isLoading,
    error,
    setReports,
    addReport,
    selectReport,
    clearSelectedReport,
    deleteReport,
    updateReport,
  };
});
