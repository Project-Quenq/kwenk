import { HTTPException } from "hono/http-exception";
import { brandingPaletteFromForm, resetBrandingPalette, saveBrandingPalette } from "../../server/db/branding.js";
import { audit } from "../../server/db/moderation/index.js";
import {
  normalizeSiteText,
  saveSiteHome,
  saveSiteRegistration,
  SiteSettingsValidationError
} from "../../server/db/siteSettings.js";
import { field } from "../../server/forms.js";
import { formAction } from "../../server/http.js";
import { limits } from "../../policy.js";
import type { CurrentUser } from "../../currentUser.js";

type SiteSettingsActionInput = { actor: CurrentUser; form: Record<string, unknown> };
type SiteSettingsRouteAction = (input: SiteSettingsActionInput) => void | Promise<void>;
type SiteSettingsActionName = "resetColor" | "color" | "home" | "registration";

const siteSettingsActions = {
  resetColor: ({ actor }: SiteSettingsActionInput) => {
    resetBrandingPalette();
    audit(actor.id, "reset_color_theme", "app_setting", 0);
  },
  color: ({ actor, form }: SiteSettingsActionInput) => {
    saveBrandingPalette(brandingPaletteFromForm(form));
    audit(actor.id, "update_color_theme", "app_setting", 0);
  },
  home: ({ actor, form }: SiteSettingsActionInput) => {
    saveSiteHome({
      announcement: normalizeSiteText(field(form, "announcement"), limits.siteAnnouncement),
      welcomeText: normalizeSiteText(field(form, "welcomeText"), limits.siteWelcomeText)
    });
    audit(actor.id, "update_site_home", "app_setting", 0);
  },
  registration: ({ actor, form }: SiteSettingsActionInput) => {
     saveSiteRegistration({
      blockedCountries: field(form, "blockedCountries")
    });
    audit(actor.id, "update", "app_setting", 0, "Updated registration rules");
  }
} satisfies Record<SiteSettingsActionName, SiteSettingsRouteAction>;

export async function runSiteSettingsAction(actor: CurrentUser, form: Record<string, unknown>) {
  try {
    await formAction(siteSettingsActions, field(form, "mode"), "Unknown site settings action.")({ actor, form });
  } catch (error) {
    if (error instanceof SiteSettingsValidationError) throw new HTTPException(400, { message: error.message });
    throw error;
  }
}