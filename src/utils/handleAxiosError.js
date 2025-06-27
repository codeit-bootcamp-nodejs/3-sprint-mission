import axios from 'axios';

const handleAxiosError = (e, label) => {
  if (axios.isAxiosError(e)) {
    const status = e.response?.status ?? 999;
    const message =
      e.response?.data?.message ||
      e.response?.data?.error?.message ||
      e.message;
    console.error(`❌ [${label}] Error: ${status} - ${message}`);
  } else {
    console.error(`❌ [${label}] Axios 외 에러:`, e);
  }
  return null;
};

export default handleAxiosError;