import type { CurrentUser } from "../../currentUser.js";
import { Layout, PageFrame, SplitLayout, SplitPane } from "../../shell/index.js";
import { Panel } from "../../ui/panels.js";
import { AdBanner } from "../../views/home/infoPanels.js";
import { preservedAppsList } from "./appShared.js";

export function renderAngryBirdsPage(user: CurrentUser | null) {
  const recommendedApps = preservedAppsList.filter((a) => a.name !== "Angry Birds Chrome").slice(0, 6);

  return (
    <Layout
      title="Play Angry Birds Chrome Online (Modded Unlimited Eagles) | Quenq"
      user={user}
      seo={{
        canonicalPath: "/apps/angry-birds-chrome",
        description: "Play the classic Angry Birds for Chrome, fully unlocked and modded with unlimited Mighty Eagles. A rare, preserved version of the delisted web game, only on Quenq.",
        type: "website"
      }}
    >
      <PageFrame width="wide" title="Play Angry Birds Chrome Online">
        <Panel title="Angry Birds Chrome" tone="strong">
          <div id="game-scale-wrapper" style="width: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden; position: relative;">
            <div id="app-container-inner" style="width: 840px; height: 480px; transform-origin: center center; flex-shrink: 0; position: relative;">
              <iframe 
                allowfullscreen={true}
                allow="fullscreen; autoplay; pointer-lock;"
                id="angry-birds-iframe"
                src="https://archive.quenq.com/apps/angry-birds-chrome/app.html"
                title="Angry Birds Chrome Application"
                style="width: 840px; height: 480px; border: none; display: block; background-color: #171c20; border-radius: var(--radius-panel);"
              ></iframe>
            </div>
          </div>
        </Panel>

        <script dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('DOMContentLoaded', () => {
            const wrapper = document.getElementById('game-scale-wrapper');
            const target = document.getElementById('app-container-inner');
            const iframe = document.getElementById('angry-birds-iframe');
            const baseWidth = 840;
            const baseHeight = 480;

            function focusGame() {
              if (iframe && iframe.contentWindow) {
                try { iframe.contentWindow.focus(); } catch(err) {}
              }
            }

            if (wrapper) {
              wrapper.addEventListener('mouseover', focusGame);
              wrapper.addEventListener('mouseenter', focusGame);
              wrapper.addEventListener('click', focusGame);
            }
            window.addEventListener('focus', focusGame);

            window.addEventListener('keydown', (e) => {
              if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                const active = document.activeElement;
                const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
                if (!isInput) {
                  e.preventDefault();
                }
              }
            });

            function handleResize() {
              if (!wrapper || !target) return;
              const availableWidth = wrapper.clientWidth;
              const maxAllowedHeight = Math.min(window.innerHeight * 0.75, baseHeight);
              const scaleX = availableWidth / baseWidth;
              const scaleY = maxAllowedHeight / baseHeight;
              const scale = Math.min(scaleX, scaleY, 1);

              target.style.transform = 'scale(' + scale + ')';
              wrapper.style.height = (baseHeight * scale) + 'px';
            }

            window.addEventListener('resize', handleResize);
            handleResize();
          });
        `}} />

        <SplitLayout variant="article">
          <SplitPane area="aside">
            <AdBanner />
          </SplitPane>

          <SplitPane area="main">
            <Panel title="About Angry Birds Chrome" tone="soft">
              <p style="margin-top: 0;"><strong>The classic you can't find anywhere else.</strong> This is the complete, beloved Angry Birds game originally released for the Google Chrome browser in 2011, a time when web gaming was exploding.</p>
              <p>After being delisted from the Chrome Web Store, this official web version became incredibly difficult to find. We've preserved it here and made it even better. Since the original in-app purchase servers are long offline, we have <strong>modded this version to give you unlimited access to the Mighty Eagle for free.</strong> Clear any level with ease!</p>
              <p>This is the definitive way to experience a piece of web gaming history, fully unlocked and ready to play exclusively on Quenq. It is also available to download directly from the App Market inside our <a href="/apps/reborn-xp">Reborn XP simulator</a>.</p>
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