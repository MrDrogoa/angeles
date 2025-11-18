import { ref } from "vue";

// Estado global compartido para el perfil
const profileComments = ref([]);
const profileAssessments = ref([]);

export function useProfileStore() {
  const setComments = (comments) => {
    profileComments.value = comments;
  };

  const getComments = () => {
    return profileComments.value;
  };

  const addComment = (comment) => {
    profileComments.value.push(comment);
  };

  const addAssessment = (hearts) => {
    profileAssessments.value.push({
      hearts,
      timestamp: new Date().toISOString(),
    });
  };

  const getAssessments = () => {
    return profileAssessments.value;
  };

  const getAverageAssessment = () => {
    if (profileAssessments.value.length === 0) return "0.0";
    const total = profileAssessments.value.reduce(
      (sum, assessment) => sum + assessment.hearts,
      0
    );
    return (total / profileAssessments.value.length).toFixed(1);
  };

  const getTotalAssessments = () => {
    return profileAssessments.value.length;
  };

  const reset = () => {
    profileComments.value = [];
    profileAssessments.value = [];
  };

  return {
    setComments,
    getComments,
    addComment,
    addAssessment,
    getAssessments,
    getAverageAssessment,
    getTotalAssessments,
    reset,
  };
}
