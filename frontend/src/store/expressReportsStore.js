import { defineStore } from "pinia";
import { ref } from "vue";

export const useExpressReportsStore = defineStore("expressReports", () => {
  // Estado
  const expressReports = ref([]);
  const selectedReport = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Acciones
  const setReports = (newReports) => {
    expressReports.value = newReports;
  };

  const addReport = (report) => {
    expressReports.value.push(report);
  };

  const selectReport = (report) => {
    selectedReport.value = report;
  };

  const clearSelectedReport = () => {
    selectedReport.value = null;
  };

  const deleteReport = (reportId) => {
    expressReports.value = expressReports.value.filter(
      (r) => r.id !== reportId
    );
  };

  const updateReport = (reportId, updatedData) => {
    const report = expressReports.value.find((r) => r.id === reportId);
    if (report) {
      Object.assign(report, updatedData);
    }
  };

  return {
    expressReports,
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
