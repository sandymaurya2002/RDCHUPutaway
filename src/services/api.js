import axios from 'axios';

// ─── BASE CONFIG ────────────────────────────────────────────────────────────
const BASE_URL = 'https://sap-api.v2retail.net'; // ✅ Configured from RFC document

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── REQUEST INTERCEPTOR (logging) ──────────────────────────────────────────
apiClient.interceptors.request.use(
  config => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  error => Promise.reject(error),
);

// ─── RESPONSE INTERCEPTOR ───────────────────────────────────────────────────
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({Status: 'E', Message: 'Request timed out. Check network.'});
    }
    if (!error.response) {
      return Promise.reject({Status: 'E', Message: 'Network error. Server unreachable.'});
    }
    return Promise.reject(
      error.response?.data || {Status: 'E', Message: 'Unexpected server error.'},
    );
  },
);

// ─── STEP 1: VALIDATE BIN ───────────────────────────────────────────────────
export const validateBin = async (user, plant, bin) => {
  try {
    const {data} = await apiClient.post('/api/ZWM_HU_MVT_BIN_VAL_RFC', {
      IM_USER: user,
      IM_PLANT: plant,
      IM_BIN: bin,
    });
    return data;
  } catch (err) {
    throw err?.Status ? err : {Status: 'E', Message: err?.message || 'BIN validation failed.'};
  }
};

// ─── STEP 2: VALIDATE HU ────────────────────────────────────────────────────
export const validateHU = async (user, plant, bin, hu) => {
  try {
    const {data} = await apiClient.post('/api/ZWM_HU_MVT_HU_VAL_RFC', {
      IM_USER: user,
      IM_PLANT: plant,
      IM_BIN: bin,
      IM_HU: hu,
    });
    return data;
  } catch (err) {
    throw err?.Status ? err : {Status: 'E', Message: err?.message || 'HU validation failed.'};
  }
};

// ─── STEP 3: SAVE PUTAWAY ───────────────────────────────────────────────────
export const savePutaway = async (user, plant, bin, hu) => {
  try {
    const {data} = await apiClient.post('/api/ZWM_HU_MVT_SAVE_RFC', {
      IM_USER: user,
      IM_PLANT: plant,
      IM_BIN: bin,
      IM_HU: hu,
    });
    return data;
  } catch (err) {
    throw err?.Status ? err : {Status: 'E', Message: err?.message || 'Save failed.'};
  }
};
