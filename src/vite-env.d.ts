/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_API_KEY: string;
  readonly VITE_EXPERT_SHEET_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 