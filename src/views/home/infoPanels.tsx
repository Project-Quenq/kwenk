import { raw } from "hono/html";
import type { SiteSettings } from "../../settings/site.js";
import { sanitizeLinkedText } from "../../server/security/html.js";
import { Panel } from "../../ui/panels.js";
import { UserContent } from "../../ui/userContent.js";

export const landingCards = [
  {
    title: "Custom profiles",
    body: "Make your profile truly feel like your own. Customize your background, colors, and layout using custom HTML and CSS, and add your favorite profile song.",
    href: "/skins",
    cta: "Browse skins"
  },
  {
    title: "No feed algorithms",
    body: "See posts in the natural chronological order they are written. We do not use algorithms to manipulate your feed, push viral trends, or promote AI-generated content.",
    href: "/privacy",
    cta: "Read our privacy details"
  },
  {
    title: "Apps & games",
    body: "Launch simulators, emulators, and classic Flash games on our main site. Use this space to share your favorite games, high scores, and join community groups.",
    href: "https://quenq.com",
    cta: "Explore the archive"
  },
  {
    title: "Cozy communities",
    body: "Join dedicated groups, write blog diaries, and find people who share your interests. Block, report, or restrict unwanted interactions easily.",
    href: "/rules",
    cta: "Review community rules"
  }
];

export function InfoCard(props: { title: string; body: string; href: string; cta: string }) {
  return (
    <div class="info-card">
      <h3>{props.title}</h3>
      <p>{props.body}</p>
      <p class="link">
        &raquo; <a href={props.href}>{props.cta}</a>
      </p>
    </div>
  );
}

export function AnnouncementBox({ settings }: { settings: SiteSettings }) {
  if (!settings.home.announcement) return null;
  return (
    <Panel className="summary-panel" title={`${settings.identity.name} announcements`} tone="soft">
      <UserContent html={sanitizeLinkedText(settings.home.announcement)} />
    </Panel>
  );
}

export function AdBanner() {
  return (
    <div style="text-align: center; overflow: hidden;">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-9156391108980330"
           data-ad-slot="7238067622"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>{raw(`(adsbygoogle = window.adsbygoogle || []).push({});`)}</script>
    </div>
  );
}

export function SponsorBanner() {
  const directLink = "https://www.effectivecpmnetwork.com/iwx7m4b8?key=51ea77e6938be3519342eed4f45d9875";

  const banners = [
    <div class="spons-bsod-banner">
      <div class="spons-bsod-title">quenq_support.sys</div>
      <div class="spons-bsod-body">
        Clicking is <span class="spons-bsod-warn">100% free and costs you nothing</span>, but pays our server bills! <br /><br />
        Note: We do not control our sponsor's page. For your safety, <span class="spons-bsod-warn">do not click on anything inside their site</span>. Just visit for 5 to 10 seconds, then return here!
      </div>
      <div class="spons-bsod-btn">Click here to support My Quenq</div>
    </div>,

    <div class="spons-tamagotchi-banner">
      <div class="spons-tamagotchi-screen">
        <div class="spons-tamagotchi-text"><b>SUPPORT MY QUENQ!</b></div>
        <div class="spons-tamagotchi-pet">(=^o^=)</div>
        <div class="spons-tamagotchi-text">
          Clicking costs you $0.00 but pays our server bills! <b style="color:#900;">Do not click anything inside their site</b>; just view it for 5 to 10 seconds and return safely!
        </div>
      </div>
      <div class="spons-tamagotchi-buttons">
        <span class="spons-tamagotchi-btn"></span>
        <span class="spons-tamagotchi-btn"></span>
        <span class="spons-tamagotchi-btn"></span>
      </div>
    </div>,

    <div class="spons-const-banner">
      <div class="spons-const-inner">
        <div class="spons-const-title">MY QUENQ SUPPORT ZONE</div>
        <div class="spons-const-body">
          Clicking is 100% free and costs you nothing, but pays our server bills! <br /><br />
          <b>Do not click anything on their site</b>. Just view it for 5 to 10 seconds and return.
        </div>
        <div class="spons-const-click">&raquo; CLICK TO SUPPORT &laquo;</div>
      </div>
    </div>,

    <div class="spons-rpg-banner">
      <div class="spons-rpg-text">
        Sponsor appeared!<br /><br />
        Clicking costs you $0.00 but pays our server bills! <i>Do not click anything inside their site!</i> Just view for 5 to 10 seconds and return.
      </div>
      <div class="spons-rpg-footer">
        <span>What will you do?</span>
        <span class="spons-rpg-cursor">&nbsp;&nbsp;Support My Quenq</span>
      </div>
    </div>,

    <div class="spons-yahoo-banner">
      <div class="spons-yahoo-header">My Quenq! <span style="color:#00f; font-size:11px; font-family:sans-serif; font-weight:normal;">Sponsor Spot</span></div>
      <div class="spons-yahoo-body">
        Clicking is 100% free and costs you nothing, but pays our server bills! <br /><br />
        We have zero control over the target page. <span class="spons-yahoo-warn">Do not click any links on their site</span>; just visit for 5 to 10 seconds, then close the tab and return! <br /><br />
        &raquo; <span style="color:#0000ee; font-weight:bold; text-decoration:underline;">Click to keep us online!</span>
      </div>
    </div>
  ];

  const randomIndex = Math.floor(Math.random() * 5);
  const SelectedBanner = banners[randomIndex];

  return (
    <div class="spons-banner-wrapper">
      <script>{raw(`
        if (!document.getElementById('spons-banner-styles')) {
          const style = document.createElement('style');
          style.id = 'spons-banner-styles';
          style.innerHTML = \`
            .spons-banner-wrapper {
              width: 300px;
              height: 250px;
              box-sizing: border-box;
              position: relative;
              justify-content: center;
              align-items: center;
              display: flex;
              margin: 0 auto;
            }
            .spons-banner-link {
              display: block;
              width: 100%;
              height: 100%;
              text-decoration: none;
              outline: none;
            }
            .spons-blink {
              animation: spons-blink-anim 1s infinite steps(1);
            }
            @keyframes spons-blink-anim {
              50% { opacity: 0; }
            }

            /* 1. BSOD Style */
            .spons-bsod-banner {
              background: #0000aa;
              border: 3px solid #cfccc2;
              color: #ffffff;
              font-family: "Courier New", Courier, monospace;
              padding: 12px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              text-align: left;
              box-sizing: border-box;
              width: 100%;
              height: 100%;
            }
            .spons-bsod-title {
              background: #ffffff;
              color: #0000aa;
              padding: 1px 6px;
              font-weight: bold;
              font-size: 11px;
              text-align: center;
            }
            .spons-bsod-body {
              font-size: 10px;
              line-height: 1.35;
            }
            .spons-bsod-warn {
              color: #ffff00;
              font-weight: bold;
            }
            .spons-bsod-btn {
              text-align: center;
              color: #00ffcc;
              font-weight: bold;
              font-size: 11px;
            }

            /* 2. Tamagotchi Style */
            .spons-tamagotchi-banner {
              background: #ff66cc;
              border: 6px solid #ff007f;
              border-radius: 40px;
              padding: 12px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              box-shadow: inset 2px 2px 0 rgba(255,255,255,0.5);
              box-sizing: border-box;
              width: 100%;
              height: 100%;
            }
            .spons-tamagotchi-screen {
              background: #8fa382;
              border: 4px solid #333;
              border-radius: 8px;
              width: 100%;
              height: 155px;
              padding: 8px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              font-family: monospace;
              color: #111;
              text-shadow: 1px 1px 0 rgba(255,255,255,0.2);
            }
            .spons-tamagotchi-text {
              font-size: 9px;
              line-height: 1.25;
              text-align: center;
            }
            .spons-tamagotchi-pet {
              font-size: 20px;
              text-align: center;
              animation: spons-bounce 0.6s infinite alternate;
            }
            .spons-tamagotchi-buttons {
              display: flex;
              gap: 12px;
            }
            .spons-tamagotchi-btn {
              width: 12px;
              height: 12px;
              background: #ffff00;
              border-radius: 50%;
              border: 1px solid #111;
            }
            @keyframes spons-bounce {
              from { transform: translateY(0); }
              to { transform: translateY(-3px); }
            }

            /* 3. Under Construction Style */
            .spons-const-banner {
              background: #111;
              border: 4px solid #ffcc00;
              box-sizing: border-box;
              padding: 8px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              background-image: repeating-linear-gradient(45deg, #ffcc00 0, #ffcc00 10px, #111 10px, #111 20px);
              width: 100%;
              height: 100%;
            }
            .spons-const-inner {
              background: #000;
              border: 2px solid #ffcc00;
              width: 100%;
              height: 100%;
              padding: 10px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              color: #ffcc00;
              font-family: "Courier New", Courier, monospace;
              text-align: center;
            }
            .spons-const-title {
              font-size: 13px;
              font-weight: bold;
              border-bottom: 2px solid #ffcc00;
              width: 100%;
              padding-bottom: 3px;
            }
            .spons-const-body {
              font-size: 10px;
              line-height: 1.35;
            }
            .spons-const-body b {
              color: #fff;
            }
            .spons-const-click {
              color: #ffff00;
              font-weight: bold;
              font-size: 11px;
              animation: spons-blink-anim 1s infinite steps(1);
            }

            /* 4. RPG Style */
            .spons-rpg-banner {
              background: #000;
              border: 4px double #fff;
              border-radius: 6px;
              padding: 12px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              font-family: "Lucida Console", Monaco, monospace;
              color: #fff;
              box-sizing: border-box;
              width: 100%;
              height: 100%;
            }
            .spons-rpg-text {
              font-size: 10px;
              line-height: 1.4;
            }
            .spons-rpg-text b {
              color: #ffff00;
            }
            .spons-rpg-text i {
              color: #ff007f;
              font-style: normal;
            }
            .spons-rpg-footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 11px;
              border-top: 1px dashed #555;
              padding-top: 6px;
            }
            .spons-rpg-cursor::before {
              content: "\\\\25b6";
              color: #fff;
              animation: spons-blink-anim 0.8s infinite steps(1);
            }

            /* 5. Yahoo Style */
            .spons-yahoo-banner {
              background: #ffffff;
              border: 3px solid #ffcc00;
              padding: 12px;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              gap: 10px;
              color: #000;
              text-align: left;
              box-sizing: border-box;
              width: 100%;
              height: 100%;
            }
            .spons-yahoo-header {
              font-family: "Impact", sans-serif;
              color: #ff007f;
              font-size: 24px;
              border-bottom: 1px solid #eee;
              padding-bottom: 2px;
              margin: 0;
            }
            .spons-yahoo-body {
              font-family: Arial, sans-serif;
              font-size: 10px;
              line-height: 1.35;
              margin: 0;
            }
            .spons-yahoo-warn {
              color: #ff0000;
              font-weight: bold;
            }
          \`;
          document.head.appendChild(style);
        }
      `)}</script>

      <a class="spons-banner-link" href={directLink} target="_blank" rel="noopener noreferrer">
        {SelectedBanner}
      </a>
    </div>
  );
}