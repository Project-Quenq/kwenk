export const siteSettingsTargetIds = {
  color: "color-theme",
  home: "home-page",
  resetColor: "color-theme"
} as const;

export function siteSettingsTargetId(mode: string) {
  return isSiteSettingsTargetMode(mode) ? siteSettingsTargetIds[mode] : undefined;
}

function isSiteSettingsTargetMode(mode: string): mode is keyof typeof siteSettingsTargetIds {
  return Object.hasOwn(siteSettingsTargetIds, mode);
}