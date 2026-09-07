/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUDIT_LABEL_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
