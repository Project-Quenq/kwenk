import type { CurrentUser } from "../../currentUser.js";
import { Layout, PageFrame, SplitLayout, SplitPane } from "../../shell/index.js";
import { Panel } from "../../ui/panels.js";
import { Icon } from "../../ui/icons.js";
import { AdBanner } from "../../views/home/infoPanels.js";
import type { ViewChild } from "../../ui/types.js";

export type AppItem = {
  name: string;
  url: string;
  thumbnail: string;
  isExternal?: boolean;
  externalUrl?: string;
};

export const preservedAppsList: AppItem[] = [
  {
    name: "Reborn XP",
    url: "/apps/reborn-xp",
    thumbnail: "https://archive.quenq.com/apps/reborn-xp/og.jpg"
  },
  {
    name: "Minecraft",
    url: "/apps/minecraft",
    thumbnail: "https://archive.quenq.com/apps/minecraft/og.jpg"
  },
  {
    name: "VC Web",
    url: "/apps/vc-web",
    thumbnail: "https://archive.quenq.com/apps/vc-web/preview.jpg"
  },
  {
    name: "Angry Birds Chrome",
    url: "/apps/angry-birds-chrome",
    thumbnail: "https://archive.quenq.com/apps/angry-birds-chrome/og.jpg"
  },
  {
    name: "3D Pinball: Space Cadet",
    url: "/apps/3d-pinball-space-cadet",
    thumbnail: "https://archive.quenq.com/apps/3d-pinball-space-cadet/og.jpg"
  },
  {
    name: "Console Emulator",
    url: "/apps/emulator",
    thumbnail: "https://archive.quenq.com/apps/emulator/og.jpg"
  },
  {
    name: "SWF Flash Player",
    url: "/apps/swf-player",
    thumbnail: "https://archive.quenq.com/apps/swf-player/og.jpg"
  },
  {
    name: "Macintosh Classic",
    url: "/apps/minivmac",
    thumbnail: "https://archive.quenq.com/apps/minivmac/MinivMac.png"
  },
  {
    name: "Hacker Simulator",
    url: "/apps/hacker-simulator",
    thumbnail: "https://archive.quenq.com/apps/hacker-simulator/og.jpg"
  },
  {
    name: "Fake Updates",
    url: "/apps/fake-updates",
    thumbnail: "https://archive.quenq.com/apps/fake-updates/updates.jpg"
  },
  {
    name: "Rickroller",
    url: "/nsfw",
    thumbnail: "https://archive.quenq.com/nsfw/og.gif"
  }
];

export const directoryAppsList: AppItem[] = [
  {
    name: "The Simpsons: Hit & Run",
    url: "#",
    externalUrl: "https://shar-wasm.cjoseph.workers.dev/?skipmovie",
    isExternal: true,
    thumbnail: "https://archive.quenq.com/images/directory/shar.jpg"
  },
  {
    name: "VC (Unofficial)",
    url: "#",
    externalUrl: "https://vcweb.studynotes.top",
    isExternal: true,
    thumbnail: "https://archive.quenq.com/images/directory/vc.jpg"
  },
  {
    name: "Web Dashers",
    url: "#",
    externalUrl: "https://web-dashers.github.io/",
    isExternal: true,
    thumbnail: "https://archive.quenq.com/images/directory/gdash.jpg"
  },
  {
    name: "Quake 3 Arena",
    url: "#",
    externalUrl: "https://dos.zone/mp/?lobby=q3",
    isExternal: true,
    thumbnail: "https://archive.quenq.com/images/directory/q3.jpg"
  },
  {
    name: "3D Phone Museum",
    url: "#",
    externalUrl: "https://chaz.fun/phonemuseum/",
    isExternal: true,
    thumbnail: "https://archive.quenq.com/images/directory/phonemuseum.jpg"
  },
  {
    name: "Counter-Strike 1.6",
    url: "#",
    externalUrl: "https://dos.zone/mp/?lobby=cs16",
    isExternal: true,
    thumbnail: "https://archive.quenq.com/images/directory/cs16.jpg"
  },
  {
    name: "Half-Life Deathmatch",
    url: "#",
    externalUrl: "https://dos.zone/mp/?lobby=hldm",
    isExternal: true,
    thumbnail: "https://archive.quenq.com/images/directory/hldm.jpg"
  },
  {
    name: "Noclip Website",
    url: "#",
    externalUrl: "https://noclip.website/",
    isExternal: true,
    thumbnail: "https://archive.quenq.com/images/directory/noclip.jpg"
  },
  {
    name: "Internet Artifacts",
    url: "#",
    externalUrl: "https://neal.fun/internet-artifacts/",
    isExternal: true,
    thumbnail: "https://archive.quenq.com/images/directory/artifacts.jpg"
  },
  {
    name: "Pointer",
    url: "#",
    externalUrl: "https://pointerpointer.com/",
    isExternal: true,
    thumbnail: "https://archive.quenq.com/images/directory/pointer.jpg"
  }
];

export type AppPlayerPageProps = {
  user: CurrentUser | null;
  appName: string;
  pageTitle: string;
  seoDescription: string;
  iframeSrc: string;
  aspectWidth: number;
  aspectHeight: number;
  fullDescriptionNode: ViewChild;
  controlsExtra?: ViewChild;
};

export function AppPlayerPage(props: AppPlayerPageProps) {
  const recommendedApps = getRandomApps(props.appName, 6);

  return (
    <Layout
      title={`${props.pageTitle} | Quenq`}
      user={props.user}
      seo={{
        canonicalPath: `/apps/${props.appName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        description: props.seoDescription,
        type: "website"
      }}
    >
      <PageFrame width="wide" title={`Play ${props.appName} Online`}>
        
        <Panel title={props.appName} tone="strong">
          <div style="width: 100%; position: relative;">
            <iframe 
              id="app-iframe"
              src={props.iframeSrc}
              title={`${props.appName} Player`}
              style={`aspect-ratio: ${props.aspectWidth} / ${props.aspectHeight}; width: 100%; border: none; background-color: #171c20; border-radius: var(--radius-panel);`}
              allow="fullscreen; autoplay; pointer-lock;"
              allowfullscreen={true}
            ></iframe>
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3); margin-top: var(--space-4);">
              <div>{props.controlsExtra ?? null}</div>
              <div>
                <button id="app-fullscreen-btn" class="button" style="cursor: pointer;">
                  <Icon name="fullscreen" /> Fullscreen
                </button>
              </div>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
              document.addEventListener('DOMContentLoaded', () => {
                const btn = document.getElementById('app-fullscreen-btn');
                const iframe = document.getElementById('app-iframe');
                if (btn && iframe) {
                  btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (iframe.requestFullscreen) { 
                      iframe.requestFullscreen(); 
                    } else if (iframe.webkitRequestFullscreen) { 
                      iframe.webkitRequestFullscreen(); 
                    }
                    if ('keyboard' in navigator && 'lock' in navigator.keyboard) {
                      navigator.keyboard.lock(['Escape']).catch(() => {});
                    }
                  });
                }
              });
            `}} />
          </div>
        </Panel>

        <SplitLayout variant="article">
          
          <SplitPane area="aside">
            <AdBanner />
          </SplitPane>

          <SplitPane area="main">
            <Panel title={`About ${props.appName}`} tone="soft">
              {props.fullDescriptionNode}
            </Panel>

            <AdBanner />

            <Panel title="You Might Also Like..." tone="soft">
              <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4); width: 100%;">
                {recommendedApps.map((otherApp) => (
                  <article key={otherApp.url} class="content-card" style="padding: 0; border-radius: var(--radius-panel); overflow: hidden;">
                    <a 
                      href={otherApp.url}
                      style={`display: block; width: 100%; aspect-ratio: 16 / 10; background-image: url('${otherApp.thumbnail}'); background-size: cover; background-position: center; position: relative; text-decoration: none;`}
                    >
                      <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); padding: var(--space-2); text-align: center;">
                        <p style="margin: 0; color: white; font-size: 10px; font-weight: bold; overflow-wrap: anywhere;">{otherApp.name}</p>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </Panel>
          </SplitPane>

        </SplitLayout>
      </PageFrame>
    </Layout>
  );
}

function getRandomApps(currentAppName: string, count = 6): AppItem[] {
  const available = preservedAppsList.filter((a) => a.name !== currentAppName);
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}