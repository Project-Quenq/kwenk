import type { Hono } from "hono";
import type { SiteSettings } from "../../settings/site.js";
import { siteSettings } from "../../server/db/siteSettings.js";
import { siteMarketingDescription, type PageSeo } from "../../settings/seo.js";
import { plainPage } from "../../server/render.js";
import type { AppBindings } from "../../server/context.js";
import type { ViewChild } from "../../ui/types.js";
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
    title: () => "About Kwenk",
    body: () => (
      <>
        <p><strong>Welcome to Kwenk.</strong> We are a nostalgic social network and digital community dedicated to bringing the human element back to the web.</p>

        <h2>What You Can Do Here</h2>
        <ul>
          <li style="margin-bottom: 10px;"><strong>Connect & Create:</strong> Write blog diaries, join community groups, leave comments on your friends' walls, and give "props" to content you love. Your feed is strictly chronological. You see what your friends post, exactly when they post it.</li>
          <li style="margin-bottom: 10px;"><strong>Express Yourself:</strong> Claim your unique handle and build a custom HTML/CSS profile. Pick a theme song, update your "current vibe," and show off your personality.</li>
          <li style="margin-bottom: 10px;"><strong>The Flash Arcade:</strong> Play thousands of classic Flash games directly in your browser. Leave reviews, give props, and chat with the community about your favorite games.</li>
        </ul>

        <h2>The Story</h2>
        <p>Our project originally started as a digital archive at <a href="https://quenq.com" target="_blank">Quenq.com</a>. A quiet museum built to preserve early internet culture. We hosted classic Flash games, internet artifacts, and created simulators like <i>Reborn XP</i> (our 1:1 Windows XP recreation) to keep the history of the early web alive and accessible.</p>

        <p>But we soon realized that preserving the software wasn't enough. What made the old web truly magical wasn't just the games or the aesthetics. It was the <strong>people</strong>. The internet used to be a place of raw creativity, where you could build your own corner of the web and genuinely connect with friends, free from algorithmic feeds, viral engagement farming, and AI-generated content (slop).</p>

        <p>To bring that back, we launched a social extension called "My Quenq." The response was incredible. Niche groups were formed, and users spent hours crafting custom profiles. It became clear that the social experience shouldn't just be an extension. As corporate social networks became increasingly dominated by algorithms, tracking, and slop, people everywhere needed a genuine alternative. So, the platform evolved into <strong>Kwenk</strong>: an open, creative social network built for anyone seeking real human connection.</p>

        <h2>The Name</h2>
        <p>What does "Kwenk" mean? Absolutely nothing. It isn't an acronym, and it doesn't have a hidden translation. It is simply the phonetic spelling of Quenq (pronounced <em>"kwenk"</em>), our sister site and home of our web museum, games, and simulators.</p>

        <h2>Support & Community</h2>
        <p>Kwenk is an independent, passion-driven project. We are funded by minimal on-site advertising to keep the platform 100% free for everyone, without paywalls or subscriptions. Registration is currently limited to selected regions to protect the community from spambots and maintain a cozy, high-quality environment.</p>

        <p>Our direction is heavily shaped by our users. Many of the features, skins, and games available on the site exist because a member suggested them right here on the platform or in our Discord server.</p>

        <div style="text-align: center; display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap;">
          <a href="https://dsc.gg/quenq" target="_blank" class="button">Join our Discord</a>
          <a href="/signup" class="button button--secondary">Create an account</a>
        </div>

        <div id="aero-ring">
          <script src="https://frutigeraeroarchive.org/javascript/aero-webring.js"></script>
        </div>

        <style>{raw(`
          #aero-ring {
            background: var(--surface-background-raised);
            border: var(--border-thin) solid var(--surface-border);
            border-radius: var(--radius-panel);
            box-shadow: var(--surface-shadow);
            font-family: var(--font-body);
            margin: var(--space-8) auto 0 auto;
            max-width: 15rem;
            padding: var(--space-5);
            text-align: center;
            color: var(--color-text);
          }

          #aero-ring a {
            color: var(--color-brand) !important;
            text-decoration: none;
            font-weight: bold;
          }

          #aero-ring a:focus, #aero-ring a:hover, #aero-ring a:active {
            color: var(--color-link-hover) !important;
            text-decoration: underline;
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
      title: () => "Privacy Policy",
      body: (settings) => (
        <>
          <p><em>Last Updated: July 31, 2026</em></p>

          <p>This Privacy Policy explains how <strong>Quenq LLC</strong> ("Company," "we," "us," or "our") collects, uses, stores, and protects information when you visit or use <strong>Kwenk</strong> at <code>kwenk.com</code> (the "Service"). By accessing or using the Service, you agree to the collection and use of information in accordance with this policy.</p>

          <h2>1. Information We Collect</h2>
          <p>We collect information to operate the Service, secure the platform, and provide a customizable social network experience.</p>

          <h3>A. Information You Provide Directly</h3>
          <ul>
            <li><strong>Account & Registration Data:</strong> When you register, we collect your display name, unique handle, email address, password (securely hashed), and time zone.</li>
            <li><strong>Profile & Customization Data:</strong> Information you voluntarily add to your profile, including your bio, interests, status, "current vibe," social media links, custom HTML/CSS profile skins, profile pictures, and theme song audio files.</li>
            <li><strong>User-Generated Content (UGC):</strong> Posts published to feeds, wall posts, group posts, blog entries, private messages (PMs), comments, replies, and "props" (likes).</li>
            <li><strong>Communications & Reports:</strong> Support messages, contact form submissions, and reports submitted regarding moderation or rule violations.</li>
          </ul>

          <h3>B. Information Collected Automatically</h3>
          <ul>
            <li><strong>Technical & Log Data:</strong> We may record basic HTTP request headers, IP addresses, browser user-agent strings, and request timestamps strictly for rate limiting, abuse prevention, anti-spam, and security auditing.</li>
            <li><strong>Session Cookies:</strong> We use essential, HTTP-only, SameSite cookies to maintain your login session and protect against Cross-Site Request Forgery (CSRF) attacks. We do not use tracking or advertising cookies directly.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the collected data exclusively for the following purposes:</p>
          <ul>
            <li>To operate, maintain, and render your user profile, custom skin, feed, messages, and social connections.</li>
            <li>To enforce rate limits, detect automated spambots, and maintain platform security.</li>
            <li>To facilitate moderation, review reported content, and enforce community rules through automated and staff review.</li>
            <li>To send essential transactional communications, such as password reset links (stored in our local outbox or sent via transactional email).</li>
          </ul>

          <h2>3. Cookies, Analytics & Advertising</h2>
          <ul>
            <li><strong>Analytics:</strong> We use Google Analytics (GA4) to collect aggregated, anonymized usage statistics to understand site performance and visitor traffic.</li>
            <li><strong>Advertising:</strong> We display advertisements served by Google AdSense and/or other Ad partners. Google and its partners may use cookies to serve ads based on a user's prior visits to our website or other websites on the internet. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
          </ul>

          <h2>4. Third-Party Profile Embeds & External Media</h2>
          <p>Kwenk allows users to customize their profile pages using sanitized HTML, CSS, and approved media embeds (such as YouTube, Spotify, SoundCloud, Bandcamp, TikTok, Vimeo, or Dailymotion), as well as external images and Google Fonts.</p>
          <p>When you visit a customized user profile, your browser may connect directly to these third-party services to load external assets. These third-party services operate independently and have their own privacy policies. Quenq LLC is not responsible for data collected by external media providers loaded through user profile skins.</p>

          <h2>5. Data Retention & User Rights (GDPR / CCPA)</h2>
          <p>We believe in user data sovereignty. You have full rights over your data:</p>
          <ul>
            <li><strong>Data Export:</strong> You can download a complete copy of all your account data, profile details, posts, blogs, messages, and comments at any time from your account settings while logged in.</li>
            <li><strong>Account Deletion:</strong> You can permanently delete your account at any time from your account settings. Deleting your account instantly and irreversibly removes your profile, posts, wall messages, custom skins, uploaded media, and social connections from our primary database.</li>
            <li><strong>Profile Privacy Settings:</strong> You can set your profile to "Private" (Friends Only) at any time. Private profiles are hidden from search engines and non-friends.</li>
          </ul>

          <h2>6. Children's Privacy (COPPA Compliance)</h2>
          <p>The Service is strictly intended for individuals who are <strong>13 years of age or older</strong>. We do not knowingly collect or solicit personal information from children under 13. If we discover that a child under 13 has created an account, we will immediately delete the account and all associated data. If you believe a child under 13 has registered, please contact us immediately at <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>.</p>

          <h2>7. Data Sharing & Legal Disclosure</h2>
          <p>Quenq LLC does <strong>not</strong> sell, rent, or trade your personal information to third parties or data brokers. We will only disclose user data if required to do so by law, subpoena, court order, or if we believe in good faith that disclosure is necessary to protect the safety, rights, or property of Quenq LLC, our users, or the public.</p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions, data requests, or privacy concerns, please contact our privacy officer at:</p>
          <p>
            <strong>Quenq LLC</strong><br />
            Email: <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>
          </p>
        </>
      )
    },
  {
      path: "/terms",
      title: () => "Terms of Service",
      body: (settings) => (
        <>
          <p><em>Last Updated: July 31, 2026</em></p>

          <p>These Terms of Service ("Terms") govern your access to and use of <code>kwenk.com</code>, its subdomains, and related interactive services (the "Service"), operated by <strong>Quenq LLC</strong> ("Company," "we," "us," or "our").</p>

          <p>By registering an account, accessing, or using the Service, you agree to be bound by these Terms. If you do not agree to all of these Terms, do not access or use the Service.</p>

          <h2>1. Eligibility & Account Security</h2>
          <ul>
            <li><strong>Age Limit:</strong> You must be at least 13 years of age to use the Service. By creating an account, you represent and warrant that you are 13 or older.</li>
            <li><strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access or security breach.</li>
            <li><strong>Handle Reservation:</strong> Handles are assigned on a first-come, first-served basis. We reserve the right to reclaim or reassign handles that infringe trademarks, impersonate staff/brands, or remain inactive indefinitely.</li>
          </ul>

          <h2>2. User-Generated Content (UGC) & Profile Customization</h2>
          <p>Kwenk provides interactive features including wall posts, feeds, groups, blogs, private messaging, comments, and HTML/CSS profile skins ("User-Generated Content" or "UGC").</p>
          
          <h3>A. Ownership & License Grant</h3>
          <p>You retain full ownership of all intellectual property rights in the content you create and post on Kwenk. By posting UGC on the Service, you grant Quenq LLC a non-exclusive, worldwide, royalty-free, sublicensable license to store, host, display, reproduce, modify (for formatting and technical display purposes), and distribute your content solely for the purpose of operating, promoting, and rendering the Service.</p>

          <h3>B. Prohibited Content & Behavior</h3>
          <p>You agree that you will NOT upload, post, transmit, or otherwise distribute content that:</p>
          <ul>
            <li>Is illegal, fraudulent, defamatory, libelous, or promotes illegal acts.</li>
            <li>Contains Not-Safe-For-Work (NSFW) material, explicit pornography, or sexually explicit depictions.</li>
            <li>Contains hate speech, racial slurs, harassment, stalking, or incitement of violence against individuals or protected groups.</li>
            <li>Contains malicious code, scripts, keyloggers, phishing links, or exploits intended to bypass site security, capture visitor cookies, or disrupt the Service.</li>
            <li>Consists of automated spam, commercial advertising, crypto/forex scams, or AI-generated low-quality text/media ("slop").</li>
            <li>Infringes upon any third party's copyright, trademark, patent, trade secret, or privacy rights.</li>
          </ul>

          <h2>3. Moderation, Automated Scans & Account Termination</h2>
          <p>We use automated filtering systems ("Automod") and staff review to scan content before or after publication. Quenq LLC reserves the right, at its sole discretion, to:</p>
          <ul>
            <li>Filter, edit, reject, or remove any UGC that violates these Terms or our community <a href="/rules">Rules</a>.</li>
            <li>Suspend, restrict, or permanently ban accounts that engage in repeated or severe rule violations.</li>
            <li>Activate anti-raid protections, rate limits, or regional registration restrictions to protect platform stability.</li>
          </ul>

          <h2>4. Copyright Policy & DMCA Takedown Procedure</h2>
          <p>Quenq LLC respects the intellectual property rights of others and complies with the Digital Millennium Copyright Act (DMCA). If you believe that content hosted on Kwenk infringes your copyright, please send a written DMCA Takedown Notice to our Designated Copyright Agent containing the following information:</p>
          <ol>
            <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material (including exact URLs).</li>
            <li>Your contact information (address, telephone number, and email address).</li>
            <li>A statement that you have a good-faith belief that use of the material is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner.</li>
          </ol>
          <p>
            <strong>Designated DMCA Agent:</strong><br />
            Quenq LLC<br />
            Attn: Copyright Agent<br />
            Email: <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>
          </p>

          <h2>5. Embedded Media Disclaimer</h2>
          <p>Kwenk indexes and embeds games and other interactive media hosted for historical preservation and educational purposes on our main site, <code>quenq.com</code>, and third-party archives. All games, trademarks, and media assets belong to their respective original authors and copyright holders. If you are a developer and wish to request removal of a preserved title, please contact us.</p>

          <h2>6. Disclaimer of Warranties</h2>
          <p>THE SERVICE IS PROVIDED ON AN <strong>"AS IS"</strong> AND <strong>"AS AVAILABLE"</strong> BASIS, WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR UNINTERRUPTED AVAILABILITY. QUENQ LLC DOES NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE, SECURE, UNINTERRUPTED, OR THAT USER DATA WILL NEVER BE LOST.</p>

          <h2>7. Limitation of Liability</h2>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL QUENQ LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY OR USER ON THE SERVICE; OR (III) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR CONTENT OR TRANSMISSIONS.</p>

          <h2>8. Indemnification</h2>
          <p>You agree to defend, indemnify, and hold harmless Quenq LLC, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorney's fees) arising out of or in any way connected with your access to or use of the Service, your User-Generated Content, or your violation of these Terms.</p>

          <h2>9. Governing Law & Jurisdiction</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the <strong>State of New Mexico, United States</strong>, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms shall be brought exclusively in the state or federal courts located in New Mexico, USA.</p>

          <h2>10. Changes to Terms</h2>
          <p>We reserve the right to modify or replace these Terms at any time. We will post updated Terms on this page with a revised "Last Updated" date. Your continued use of the Service after any changes constitutes acceptance of the new Terms.</p>

          <h2>11. Contact Information</h2>
          <p>If you have any questions regarding these Terms, please contact us at:</p>
          <p>
            <strong>Quenq LLC</strong><br />
            Email: <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>
          </p>
        </>
      )
    },
  {
      path: "/help",
      title: () => "Help & How-To Guide",
      body: () => (
        <>
          <p><strong>Welcome to the Kwenk Help Center!</strong> Here is a quick guide on how to navigate the platform, customize your space, and interact with the community.</p>

          <h2>Profiles & Customization</h2>
          <ul>
            <li style="margin-bottom: 8px;"><strong>Edit Profile:</strong> Go to <a href="/account/profile">Edit Profile</a> to change your display name, profile picture, bio, interests, and social media links.</li>
            <li style="margin-bottom: 8px;"><strong>Theme Songs:</strong> You can upload an MP3 audio file to play automatically when people visit your profile page.</li>
            <li style="margin-bottom: 8px;"><strong>Profile Skins (HTML/CSS):</strong> Customize your layout with HTML and CSS in the Skin section, or use our <strong>Generate Color Skin</strong> button for instant theme colors. You can also browse, preview, and apply community-made skins from the <a href="/skins">Skins Library</a>.</li>
            <li style="margin-bottom: 8px;"><strong>Status & Vibe:</strong> Update your current mood and quote anytime via <a href="/account/status">Edit Status</a>.</li>
          </ul>

          <h2>The Flash Arcade</h2>
          <ul>
            <li style="margin-bottom: 8px;"><strong>Playing Games:</strong> Anyone can browse and play thousands of classic Flash games in the <a href="/arcade">Arcade</a> without creating an account.</li>
            <li style="margin-bottom: 8px;"><strong>Game Discussion & Props:</strong> Logged-in members can give "Props" (likes) to their favorite games and post comments or strategy guides under any game player.</li>
          </ul>

          <h2>Posts, Blogs & Socializing</h2>
          <ul>
            <li style="margin-bottom: 8px;"><strong>Wall & Feed Posts:</strong> Post updates on your wall or the main <a href="/feed">Feed</a>. Posts support text and image uploads. You can comment and reply to posts in nested threads.</li>
            <li style="margin-bottom: 8px;"><strong>Blog Entries:</strong> Write short or long-form entries in the <a href="/blog">Blog</a>. Blogs support categories, search, pinning, and 3 privacy levels: <em>Public (Everyone)</em>, <em>Friends Only</em>, and <em>Private Diary</em>.</li>
            <li style="margin-bottom: 8px;"><strong>Groups:</strong> Explore or create <a href="/groups">Groups</a> to gather around shared interests and post inside group-specific walls.</li>
            <li style="margin-bottom: 8px;"><strong>Giving Props:</strong> Click "Prop" on any post, blog entry, or game to show appreciation to the author.</li>
          </ul>

          <h2>Account, Settings & Security</h2>
          <ul>
            <li style="margin-bottom: 8px;"><strong>Dark Mode:</strong> Toggle light/dark theme anytime using the sun/moon icon in the top navigation bar.</li>
            <li style="margin-bottom: 8px;"><strong>Notifications:</strong> Click the bell icon in the top header to view replies, wall posts, props, and friend requests. Customize notification preferences in <a href="/settings">Account Settings</a>.</li>
            <li style="margin-bottom: 8px;"><strong>Data Sovereignty:</strong> Export all your account data at any time, or permanently delete your account from <a href="/account">account settings</a>.</li>
          </ul>

          <p>Need extra help or have a bug to report? Join our community on <a href="https://dsc.gg/quenq" target="_blank">Discord</a> or send us a message via the <a href="/contact">Contact page</a>.</p>
        </>
      )
    },
  {
      path: "/rules",
      title: () => "Community Rules",
      body: () => (
        <>
          <p>Our rules are simple and designed to keep this community creative, human, and safe for everyone. By using Kwenk, you agree to follow these guidelines.</p>
          
          <p><strong>1. English in Public Spaces:</strong> To help us moderate effectively and keep the global community connected, please use English in the main public feeds and global groups. You are 100% welcome to use any language on your personal profile, in your own blog entries, or inside your personal groups.</p>
          
          <p><strong>2. No AI-Generated Content or Slop:</strong> Kwenk was built to celebrate authentic human expression. Please do not post AI-generated art, AI-written text "slop", or use automated bots to post content.</p>
          
          <p><strong>3. No NSFW or Illegal Content:</strong> Do not post sexually explicit material, pornography, extreme violence, or illegal content. We want to keep this platform safe and comfortable for everyone.</p>
          
          <p><strong>4. Be Decent to Others:</strong> Do not harass, threaten, bully, doxx, or impersonate others. Do not post malware, phishing links, or private personal information.</p>
          
          <p><strong>5. Respect Profile Skins & Custom CSS:</strong> Custom HTML/CSS profile skins are a core feature of Kwenk. Do not use profile skins, CSS, or embedded players to attack visitors, lag/crash browsers, hide malicious links, or make your page impossible to navigate or report.</p>

          <p><strong>6. No Multi-Account Abuse:</strong> Do not create alternate accounts to evade bans, manipulate "Props" (likes), or harass other members. Ban evasion will result in permanent account termination across all associated accounts.</p>
          
          <p><strong>Moderation & Community Staff:</strong> Kwenk staff (moderators) are volunteer community members who help keep the site safe, not employees or official representatives of Quenq LLC. Staff reserve the right to remove content, restrict features, or ban accounts at their discretion to enforce these rules. If you see content that breaks the rules, please use the <strong>Report</strong> button.</p>
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