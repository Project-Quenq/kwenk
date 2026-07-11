import { limits } from "../../policy.js";
import {
  siteIdentity,
  siteContact,
  defaultSiteSettings,
  type SiteHomeSettings,
  type SiteRegistrationSettings,
  type SiteSettings
} from "../../settings/site.js";
import { recordFromUnknown, stringFromUnknown } from "../../values.js";
import { saveSetting, settingRow } from "./settings.js";

type StoredSiteSettings = {
  home: SiteHomeSettings;
  registration: SiteRegistrationSettings;
};

export class SiteSettingsValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SiteSettingsValidationError";
  }
}

const siteSettingsKey = "site.settings";

export function siteSettings(): SiteSettings {
  const row = settingRow(siteSettingsKey);
  const stored = parseSiteSettingsJson(row?.value);
  return { 
    identity: siteIdentity,
    contact: siteContact,
    home: stored.home,
    registration: stored.registration,
    updatedAt: row?.updatedAt ?? null 
  };
}

export function saveSiteHome(home: SiteHomeSettings) {
  saveSiteSettings({ ...storedCurrentSettings(), home: normalizeHome(home) });
}

export function saveSiteRegistration(registration: SiteRegistrationSettings) {
  saveSiteSettings({ ...storedCurrentSettings(), registration: normalizeRegistration(registration) });
}

export function normalizeSiteText(value: string, maxLength: number) {
  return cleanText(value, maxLength);
}

function storedCurrentSettings(): StoredSiteSettings {
  const row = settingRow(siteSettingsKey);
  return parseSiteSettingsJson(row?.value);
}

function saveSiteSettings(settings: StoredSiteSettings) {
  saveSetting(siteSettingsKey, JSON.stringify(settings));
}

function parseSiteSettingsJson(value: string | null | undefined): StoredSiteSettings {
  if (!value) return defaultStoredSettings();
  try {
    return normalizeStoredSiteSettings(JSON.parse(value));
  } catch {
    return defaultStoredSettings();
  }
}

function defaultStoredSettings(): StoredSiteSettings {
  return {
    home: defaultSiteSettings.home,
    registration: defaultSiteSettings.registration
  };
}

function normalizeStoredSiteSettings(value: unknown): StoredSiteSettings {
  const record = recordFromUnknown(value);
  return {
    home: normalizeHome(record.home),
    registration: normalizeRegistration(record.registration)
  };
}

function normalizeHome(value: unknown): SiteHomeSettings {
  const record = recordFromUnknown(value);
  const defaults = defaultSiteSettings.home;
  return {
    announcement: textSetting(record, "announcement", limits.siteAnnouncement, defaults.announcement),
    welcomeText: textSetting(record, "welcomeText", limits.siteWelcomeText, defaults.welcomeText)
  };
}

function normalizeRegistration(value: unknown): SiteRegistrationSettings {
  const record = recordFromUnknown(value);
  return {
    blockedCountries: stringFromUnknown(record.blockedCountries).toUpperCase().replace(/\s+/g, "")
  };
}

function cleanText(value: unknown, maxLength: number) {
  return stringFromUnknown(value).replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().slice(0, maxLength);
}

function textSetting(record: Record<string, unknown>, key: string, maxLength: number, fallback: string) {
  return key in record ? cleanText(record[key], maxLength) : fallback;
}