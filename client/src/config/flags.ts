// Feature flags for gradual rollout
export const IS_UNIFIED_SHELL = (import.meta.env.VITE_IS_UNIFIED_SHELL ?? "true") === "true";

// Other feature flags
export const ENABLE_VDR = (import.meta.env.VITE_ENABLE_VDR ?? "false") === "true";
export const ENABLE_TEAM_MANAGEMENT = (import.meta.env.VITE_ENABLE_TEAM_MANAGEMENT ?? "false") === "true";