// ─── APP CONFIGURATION ──────────────────────────────────────────────────────
// Configured from: RDC_TO_RDC_RFC_DOC_android_V1.docx

export const USERS = [
  {label: '901 - Warehouse User', value: '901'},
  {label: '250 - Warehouse User 2', value: '250'},
  {label: '251 - Supervisor', value: '251'},
];

export const PLANTS = [
  {label: 'DW01 - RDC Warehouse', value: 'DW01'},
  {label: 'DH24 - RDC Delhi', value: 'DH24'},
];

export const DEFAULTS = {
  USER: '901',
  PLANT: 'DW01',
};

// BINs starting with this prefix keep their value after save
export const STICKY_BIN_PREFIX = '001';
