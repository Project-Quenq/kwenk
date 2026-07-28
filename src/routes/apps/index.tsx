import { Hono } from "hono";
import { currentUser } from "../../server/auth/session.js";
import { Layout, PageFrame, SplitLayout, SplitPane } from "../../shell/index.js";
import { AdBanner, AdBannerMain } from "../../views/home/infoPanels.js";
import { Icon } from "../../ui/icons.js";
import type { AppBindings } from "../../server/context.js";
import { preservedAppsList, directoryAppsList } from "./appShared.js";

import { renderRebornXpPage } from "./rebornXp.js";
import { renderMinecraftPage } from "./minecraft.js";
import { renderVcWebPage } from "./vcWeb.js";
import { renderAngryBirdsPage } from "./angryBirds.js";
import { renderPinballPage } from "./pinball.js";
import { renderEmulatorPage } from "./emulator.js";
import { renderSwfPlayerPage } from "./swfPlayer.js";
import { renderMinivmacPage } from "./minivmac.js";
import { renderHackerSimulatorPage } from "./hackerSimulator.js";
import { renderFakeUpdatesPage } from "./fakeUpdates.js";
import { renderRickrollPage } from "./rickroll.js";

export function registerAppsRoutes(app: Hono<AppBindings>) {
  
  app.get("/apps", (c) => {
    const user = currentUser(c);
    return c.html(
      <Layout
        title="Apps - Digital Artifacts & Web Preservation | Quenq"
        user={user}
        seo={{
          canonicalPath: "/apps",
          description: "Welcome to the Quenq Apps. A curated archive of high-fidelity simulators, internet culture artifacts, and historical software preserved for the modern web."
        }}
      >
        <PageFrame width="wide" title="Apps">
          <p style="margin: 0 0 var(--space-3) 0;"><strong>The Quenq Apps library</strong> is our digital sanctuary for internet culture.</p>
          <p style="margin: 0 0 var(--space-6) 0;">From high-fidelity simulators to legendary web pranks and browser ports of classic games, every item in this library is a functional artifact. Whether you are here to revisit the golden age of computing or explore a modern digital curiosity, everything is preserved to run natively in your browser.</p>

          <SplitLayout variant="article">
            
            <SplitPane area="aside">
              <AdBanner />
            </SplitPane>

            <SplitPane area="main">
              <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4);">
                
                {preservedAppsList.map((item) => (
                  <article key={item.url} class="content-card" style="padding: 0; overflow: hidden;">
                    <a 
                      href={item.url}
                      style={`display: block; width: 100%; aspect-ratio: 16 / 10; background-image: url('${item.thumbnail}'); background-size: cover; background-position: center; position: relative; text-decoration: none;`}
                    >
                      <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); padding: var(--space-2); text-align: center;">
                        <p style="margin: 0; color: white; font-size: 11px; font-weight: bold; overflow-wrap: anywhere;">{item.name}</p>
                      </div>
                    </a>
                  </article>
                ))}

                {directoryAppsList.map((item) => (
                  <article key={item.externalUrl} class="content-card" style="padding: 0; overflow: hidden;">
                    <a 
                      class="external-directory-card"
                      href={item.externalUrl}
                      data-url={item.externalUrl}
                      style={`display: block; width: 100%; aspect-ratio: 16 / 10; background-image: url('${item.thumbnail}'); background-size: cover; background-position: center; position: relative; text-decoration: none;`}
                    >
                      <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); padding: var(--space-2); text-align: center;">
                        <p style="margin: 0; color: white; font-size: 11px; font-weight: bold; overflow-wrap: anywhere; display: flex; align-items: center; justify-content: center; gap: var(--space-1);">
                        <Icon name="external-link" />
                        <span>{item.name}</span>
                        </p>
                      </div>
                    </a>
                  </article>
                ))}
              </div>

              <AdBannerMain />
            </SplitPane>

          </SplitLayout>

          <script dangerouslySetInnerHTML={{ __html: `
            document.addEventListener('DOMContentLoaded', () => {
              const externalCards = document.querySelectorAll('.external-directory-card');
              externalCards.forEach(card => {
                card.addEventListener('click', (e) => {
                  e.preventDefault();
                  const url = card.getAttribute('data-url');
                  if (!url) return;

                  const width = 800;
                  const height = 600;
                  const left = (window.screen.width / 2) - (width / 2);
                  const top = (window.screen.height / 2) - (height / 2);

                  window.open(
                    url,
                    '_blank',
                    \`location=no,resizable=yes,height=\${height},width=\${width},scrollbars=yes,status=no,top=\${top},left=\${left}\`
                  );
                });
              });
            });
          `}} />
        </PageFrame>
      </Layout>
    );
  });

  app.get("/apps/reborn-xp", (c) => c.html(renderRebornXpPage(currentUser(c))));
  app.get("/apps/minecraft", (c) => c.html(renderMinecraftPage(currentUser(c))));
  app.get("/apps/vc-web", (c) => c.html(renderVcWebPage(currentUser(c))));
  app.get("/apps/angry-birds-chrome", (c) => c.html(renderAngryBirdsPage(currentUser(c))));
  app.get("/apps/3d-pinball-space-cadet", (c) => c.html(renderPinballPage(currentUser(c))));
  app.get("/apps/emulator", (c) => c.html(renderEmulatorPage(currentUser(c))));
  app.get("/apps/swf-player", (c) => c.html(renderSwfPlayerPage(currentUser(c))));
  app.get("/apps/minivmac", (c) => c.html(renderMinivmacPage(currentUser(c))));
  app.get("/apps/hacker-simulator", (c) => c.html(renderHackerSimulatorPage(currentUser(c))));
  app.get("/apps/fake-updates", (c) => c.html(renderFakeUpdatesPage(currentUser(c))));
  
  app.get("/nsfw", (c) => c.html(renderRickrollPage()));
}