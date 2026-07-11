import type { BrandingSettings } from "../../settings/branding.js";
import type { SiteSettings } from "../../settings/site.js";
import { limits } from "../../policy.js";
import { ActionLabel } from "../../ui/actions.js";
import { ColorSwatches } from "../../ui/colorSwatches.js";
import { CsrfInput, FormActions, FormField, FormStack } from "../../ui/forms.js";
import { Panel } from "../../ui/panels.js";
import { siteSettingsTargetIds } from "./siteSettingsTargets.js";

export function SiteSettingsPanel({ colorTheme, csrf, siteSettings }: { colorTheme: BrandingSettings; csrf: string; siteSettings: SiteSettings }) {
  return (
    <>
      <HomePagePanel csrf={csrf} settings={siteSettings} />
      <RegistrationSettingsPanel csrf={csrf} settings={siteSettings} />
      <ColorThemePanel csrf={csrf} settings={colorTheme} />
    </>
  );
}

function HomePagePanel({ csrf, settings }: { csrf: string; settings: SiteSettings }) {
  return (
    <Panel id={siteSettingsTargetIds.home} title="Home page">
      <FormStack action="/admin/branding" actionFragment={siteSettingsTargetIds.home}>
        <CsrfInput csrf={csrf} />
        <input type="hidden" name="mode" value="home" />
        <FormField label="Welcome text">
          <textarea name="welcomeText" rows={3} maxLength={limits.siteWelcomeText}>{settings.home.welcomeText}</textarea>
        </FormField>
        <FormField label="Announcement" hint="Leave blank to hide the announcement box.">
          <textarea class="text-editor text-editor--short" name="announcement" rows={4} maxLength={limits.siteAnnouncement}>{settings.home.announcement}</textarea>
        </FormField>
        <FormActions>
          <button type="submit"><ActionLabel action="save">Save home page</ActionLabel></button>
        </FormActions>
      </FormStack>
    </Panel>
  );
}

function RegistrationSettingsPanel({ csrf, settings }: { csrf: string; settings: SiteSettings }) {
  return (
    <Panel title="Registration rules">
      <FormStack action="/admin/branding">
        <CsrfInput csrf={csrf} />
        <input type="hidden" name="mode" value="registration" />
        <FormField 
          label="Blocked countries (ISO codes)" 
          hint="Comma separated ISO 3166-1 alpha-2 codes (e.g. IN, RU, CN). These regions will be prevented from registering based on their timezone."
        >
          <input type="text" name="blockedCountries" value={settings.registration.blockedCountries} placeholder="e.g. IN, RU" />
        </FormField>
        <FormActions>
          <button type="submit"><ActionLabel action="save">Save registration rules</ActionLabel></button>
        </FormActions>
      </FormStack>
    </Panel>
  );
}

function ColorThemePanel({ csrf, settings }: { csrf: string; settings: BrandingSettings }) {
  return (
    <Panel id={siteSettingsTargetIds.color} title="Color theme">
      <FormStack action="/admin/branding" actionFragment={siteSettingsTargetIds.color}>
        <CsrfInput csrf={csrf} />
        <ColorSwatches palette={settings.palette} />
        <FormActions>
          <button type="submit" name="mode" value="color"><ActionLabel action="save">Save color theme</ActionLabel></button>
          {settings.customized ? <button class="button--secondary" type="submit" name="mode" value="resetColor">Reset color theme</button> : null}
        </FormActions>
      </FormStack>
    </Panel>
  );
}