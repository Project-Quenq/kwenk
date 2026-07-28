import type { CurrentUser } from "../../currentUser.js";
import { Layout, PageFrame, SplitLayout, SplitPane } from "../../shell/index.js";
import { AdBanner, AdBannerMain } from "../../views/home/infoPanels.js";

export function renderFakeUpdatesPage(user: CurrentUser | null) {
  const fakeOS = [
    { name: "Windows 11", slug: "win11", img: "https://archive.quenq.com/apps/fake-updates/win11/eleven.png" },
    { name: "Windows 10", slug: "win10", img: "https://archive.quenq.com/apps/fake-updates/assets/windows 10.png" },
    { name: "Windows 8", slug: "win8", img: "https://archive.quenq.com/apps/fake-updates/assets/windows 8.png" },
    { name: "Windows 7", slug: "win7", img: "https://archive.quenq.com/apps/fake-updates/assets/windows 7.png" },
    { name: "Windows Vista", slug: "vista", img: "https://archive.quenq.com/apps/fake-updates/assets/windows vista.png" },
    { name: "Windows XP", slug: "xp", img: "https://archive.quenq.com/apps/fake-updates/assets/windows xp.png" },
    { name: "Windows 98", slug: "98", img: "https://archive.quenq.com/apps/fake-updates/98/98.png" },
    { name: "Chrome OS", slug: "chromeos", img: "https://archive.quenq.com/apps/fake-updates/chromeos/chromeos.png" },
    { name: "Ubuntu", slug: "ubuntu", img: "https://archive.quenq.com/apps/fake-updates/ubuntu/ubuntu.png" },
    { name: "macOS", slug: "apple", img: "https://archive.quenq.com/apps/fake-updates/apple/mac.png" }
  ];

  return (
    <Layout
      title="Fake Update Pranks - Windows, Mac & More | Quenq"
      user={user}
      seo={{
        canonicalPath: "/apps/fake-updates",
        description: "Prank your friends with ultra-realistic fake operating system update screens. The prank triggers a Blue Screen of Death (BSOD) when users press 'Enter'."
      }}
    >
      <div id="prank-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 99999;">
        <iframe id="prank-iframe" style="width: 100%; height: 100%; border: none;"></iframe>
      </div>

      <PageFrame width="wide" title="Fake Update Pranks">
        <p><strong>How to use this prank:</strong> Select an operating system from the cards below. The tool will launch a realistic, full-screen 'Update in Progress' animation. For the best effect, use it on a friend's unlocked computer and walk away.</p>
        <p>When they return, they will be stuck watching the fake progress bar. The prank ends with a classic Blue Screen of Death (BSOD) when the update finishes or if they press the <strong>Enter</strong> key.</p>
        <p>This collection is a tribute to the golden age of office humor and harmless digital tricks. It is the perfect tool for a lighthearted moment with friends, family, or coworkers.</p>

        <SplitLayout variant="article">
          
          <SplitPane area="aside">
            <AdBanner />
          </SplitPane>

          <SplitPane area="main">
            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4);">
              {fakeOS.map((os) => (
                <article key={os.slug} class="content-card" style="padding: 0; overflow: hidden;">
                  <a 
                    class="prank-trigger-btn"
                    href={`https://archive.quenq.com/apps/fake-updates/${os.slug}/index.html`}
                    style={`display: block; width: 100%; aspect-ratio: 16 / 10; background-image: url('${os.img}'); background-size: cover; background-position: center; position: relative; text-decoration: none;`}
                  >
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); padding: var(--space-2); text-align: center;">
                      <p style="margin: 0; color: white; font-size: 11px; font-weight: bold; overflow-wrap: anywhere;">{os.name}</p>
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
            const overlay = document.getElementById('prank-overlay');
            const iframe = document.getElementById('prank-iframe');
            const buttons = document.querySelectorAll('.prank-trigger-btn');

            buttons.forEach(btn => {
              btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!overlay || !iframe) return;

                iframe.src = btn.getAttribute('href');
                overlay.style.display = 'block';

                if (overlay.requestFullscreen) { overlay.requestFullscreen(); }
                else if (overlay.webkitRequestFullscreen) { overlay.webkitRequestFullscreen(); }

                if ('keyboard' in navigator && 'lock' in navigator.keyboard) {
                  navigator.keyboard.lock(['Escape']).catch(() => {});
                }
              });
            });

            const exitHandler = () => {
              if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                if (overlay) overlay.style.display = 'none';
                if (iframe) iframe.src = '';
              }
            };

            document.addEventListener('fullscreenchange', exitHandler);
            document.addEventListener('webkitfullscreenchange', exitHandler);
          });
        `}} />
      </PageFrame>
    </Layout>
  );
}