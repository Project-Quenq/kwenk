import type { Hono } from "hono";
import type { SiteSettings } from "../../settings/site.js";
import { siteSettings } from "../../server/db/siteSettings.js";
import { siteMarketingDescription, type PageSeo } from "../../settings/seo.js";
import { plainPage } from "../../server/render.js";
import type { AppBindings } from "../../server/context.js";
import { raw } from "hono/html";

type StaticPage = {
  path: string;
  seo?: (settings: SiteSettings) => PageSeo;
  title: (settings: SiteSettings) => string;
  body: (settings: SiteSettings) => ViewChild;
};

const staticPages: readonly StaticPage[] = [
  {
    path: "/about",
    title: () => "About Quenq",
    body: () => (
      <>
        <p><strong>Welcome to Quenq!</strong> We are a nostalgic social network and digital community dedicated to bringing the human element back to the web.</p>

        <p>We missed the days when the internet was about creativity, expression, and connecting with friends, rather than algorithms, viral trends, and AI-generated slop. Here, you can claim your piece of the retro web, build a custom HTML/CSS profile page, share your favorite profile music, write blogs, and connect with a community that shares your passion.</p>

        <p>Alongside our social network, Quenq is also home to an interactive digital library. Directly in your browser, you can explore preserved software, run classic operating system simulations like <i>Reborn XP</i>, and play an extensive library of classic Flash arcade games.</p>

        <h2>What You Can Do Here</h2>
        <ul>
          <li style="margin-bottom: 10px;"><strong>Custom Social Profiles:</strong> Express yourself freely with custom HTML/CSS profiles, status updates, music players, wall posts, blogs, and community groups.</li>
          <li style="margin-bottom: 10px;"><strong>The Arcade:</strong> Play over 1,300 classic Flash browser games, preserved using modern WebAssembly emulation so they run natively without plugins or downloads.</li>
          <li style="margin-bottom: 10px;"><strong>The Apps:</strong> Launch internet artifacts, games and simulators like <i>Reborn XP</i> (our 1:1 Windows XP recreation), console emulators, and web pranks.</li>
        </ul>

        <h2>The Name & Symmetry</h2>
        <p>When the domain was registered, "quenq" was chosen simply because it is visually and structurally perfect. It is completely symmetrical: the two <strong>q</strong>s act as bookends, the <strong>u</strong> and <strong>n</strong> are upside-down reflections of each other, and they are anchored by the <strong>e</strong> in the center.</p>

        <h2>Support & Community</h2>
        <p>Quenq is an independent passion project funded by minimal on-site advertising to keep the platform 100% free for everyone, without paywalls or subscriptions. Registration is currently limited to selected regions to protect the community from spam bots and maintain a cozy, high-quality environment.</p>

        <p>Our direction is heavily shaped by our users. Many of the features, artifacts and games available on the site exist because a member suggested them here or in our Discord server.</p>

        <div style="text-align: center; display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap;">
          <a href="https://dsc.gg/quenq" target="_blank" class="button">Join our Discord</a>
          <a href="/signup" class="button button--secondary">Create an account</a>
        </div>

        <div id="aero-ring">
          <script src="https://frutigeraeroarchive.org/javascript/aero-webring.js"></script>
        </div>

        <style>{raw(`
          #aero-ring {
            background: linear-gradient(to bottom, #404040 0%, #000000 100%);
            border-radius: 10px;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.5),
              inset 0 2px 1px rgba(255, 255, 255, 0.15),
              inset 0 -2px 1px rgba(0, 0, 0, 0.35);
            font-family: sans-serif;
            margin: 20px auto 0px auto;
            max-width: 15rem;
            padding: 0.75rem;
            text-align: center;
          }

          #aero-ring a, #aero-ring a:visited {
            color: white !important;
          }

          #aero-ring a:focus, #aero-ring a:hover, #aero-ring a:active {
            color: lightgrey !important;
          }
        `)}</style>
      </>
    )
  },
  {
    path: "/contact",
    title: () => "Contact",
    body: (settings) => (
      <>
        <p>For support, privacy questions, copyright notices, or security concerns, use the contact information below.</p>
        {contactEmail(settings)}
        <p>
          <strong>{settings.contact.companyName}</strong>
          {mailingAddress(settings)}
        </p>
      </>
    )
  },
  {
    path: "/privacy",
    title: () => "Privacy",
    body: (settings) => (
      <>
        <p>{settings.identity.name} stores only the information necessary to run a social community. This includes your email address, username, password hash, session records, profile text, posts, blogs, messages, uploaded media, and timestamps.</p>
        <p>Uploaded profile pictures, post images, and theme songs are stored securely on our servers.</p>
        <p>You have control over your data. You can change your profile visibility in your account settings. Private profiles are visible only to the profile owner, accepted friends, and staff. Blog entries also feature their own individual privacy settings.</p>
        <p>Please note that custom profile skins can include third party images, fonts, and embedded media players (like YouTube or Spotify) chosen by the profile author. Visiting those profiles means your browser may connect to those external services, which are governed by their own privacy policies.</p>
        <p>You can export your account data or permanently delete your account at any time from your settings. Basic server logs and backups are kept temporarily strictly for security, moderation, and maintenance purposes.</p>
        {settings.contact.email ? <p>Questions: <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a></p> : null}
      </>
    )
  },
  {
    path: "/terms",
    title: () => "Terms",
    body: (settings) => (
      <>
        <p>By using {settings.identity.name}, you agree to these terms, our <a href="/privacy">Privacy Policy</a>, and our community <a href="/rules">Rules</a>.</p>
        <p>You must be at least 13 years old to create an account. You must use your own account, and you agree not to try to break, overload, or abuse the site infrastructure.</p>
        <p>You are solely responsible for what you post, upload, message, share, and add to your custom profile skins. Do not post content you do not have the legal right to use.</p>
        <p>You retain full ownership of your content. By posting it, you grant {settings.identity.name} a license to store, display, and process it as needed to run the website.</p>
        <p>Staff members may remove content, limit features, or suspend accounts at their sole discretion if a user breaks these terms, the rules, or threatens the security of the service.</p>
        {dmcaNotice(settings)}
        <p><strong>Limitation of Liability:</strong> {settings.identity.name} is an independent, hobbyist project. The service is provided strictly on an "AS IS" and "AS AVAILABLE" basis, without any warranties. To the fullest extent permitted by law, the creators, hosts, and moderators of {settings.identity.name} shall not be held liable for any data loss, downtime, indirect damages, or issues arising from user generated content.</p>
      </>
    )
  },
  {
    path: "/help",
    title: () => "Help",
    body: () => (
      <>
        <p>Use edit profile to change your name, picture, theme song, bio, interests, social links, and skin HTML. Your public profile address is set during signup.</p>
        <p>Wall posts and group posts support one image, props, comments, and comment replies. Blog entries support categories, privacy, pinning, props, comments, and comment replies.</p>
        <p>Skins are shared from the skins page and can be previewed before applying them to your profile.</p>
      </>
    )
  },
  {
    path: "/rules",
    title: () => "Rules",
    body: () => (
      <>
        <p>Be decent to other people and do not use the site to make their lives harder.</p>
        
        <p><strong>Keep public spaces in English:</strong> To help us moderate effectively and keep the community connected, please use English in the main public feeds and global groups. You are fully welcome to use other languages on your personal profile, in your own blogs, or within your own personal groups.</p>
        
        <p><strong>No AI-generated content:</strong> This network was built to escape the modern web and celebrate authentic human creativity. Please do not post AI-generated art, text "slop", or use automated bots to post.</p>
        
        <p><strong>No NSFW content:</strong> Do not post sexually explicit material, pornography, or illegal content. We want to keep this corner of the web safe and comfortable for everyone.</p>
        
        <p>Do not harass people, threaten people, spam, impersonate others, or evade moderation. Do not post malware, phishing links, or stolen private information.</p>
        
        <p>Do not use profile skins, embeds, uploads, or links to attack visitors, hide malicious content, or break the site.</p>
        
        <p>Staff may remove content, restrict features, or ban accounts when needed to keep the site safe. If you see something that breaks the rules, please report it to the moderators.</p>
      </>
    )
  }
];

export function registerSiteRoutes(app: Hono<AppBindings>) {
  for (const page of staticPages) {
    app.get(page.path, (c) => {
      const settings = siteSettings();
      return plainPage(c, page.title(settings), page.body(settings), 200, page.seo?.(settings));
    });
  }
}

function contactEmail(settings: SiteSettings) {
  return settings.contact.email
    ? <p><a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a></p>
    : <p>No contact email has been configured yet.</p>;
}

function mailingAddress(settings: SiteSettings) {
  const lines = settings.contact.mailingAddress.split("\n").map((line) => line.trim()).filter(Boolean);
  return lines.length ? (
    <>
      <br />
      {lines.map((line) => (
        <>
          {line}
          <br />
        </>
      ))}
    </>
  ) : null;
}

function dmcaNotice(settings: SiteSettings) {
  return settings.contact.email ? (
    <p>DMCA notices can be sent to <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>. Include the copyrighted work, the allegedly infringing URL or material, your contact information, a good-faith statement, a statement that the notice is accurate under penalty of perjury, and your physical or electronic signature. Repeat infringers may have content removed or accounts terminated.</p>
  ) : (
    <p>Copyright notices can be sent through the contact information on the Contact page. Repeat infringers may have content removed or accounts terminated.</p>
  );
}