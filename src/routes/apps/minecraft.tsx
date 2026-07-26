import type { CurrentUser } from "../../currentUser.js";
import { AppPlayerPage } from "./appShared.js";

export function renderMinecraftPage(user: CurrentUser | null) {
  const controlsExtra = (
    <div style="display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
      <span id="current-mode-display" style="font-weight: bold; font-size: 11px; color: var(--color-brand);">
        Running in: WASM Mode (High Performance)
      </span>
      <button id="mode-toggle-btn" class="button button--secondary" style="cursor: pointer;">
        Switch Mode
      </button>
    </div>
  );

  const fullDescriptionNode = (
    <div>
      <p style="margin-top: 0;">Minecraft is a game about breaking and placing blocks. At first, people built structures to protect against nocturnal monsters, but as the game grew players worked together to create wonderful, imaginative things.</p>
      <p>It can also be about adventuring with friends or watching the sun rise over a blocky ocean. It's pretty. Brave players battle terrible things in The Nether, which is more scary than pretty. You can also visit a land of mushrooms if it sounds more like your cup of tea.</p>
      <p>You can play Minecraft on PC, Mac, or directly in your <strong>browser</strong>. This version runs a full <strong>Minecraft</strong> experience thanks to Eaglercraft. No Java, no downloads, just open and play. It works on Chromebooks, iPads, phones, and even smart TVs.</p>
      
      <b>Which Mode Should I Choose?</b>
      <p>We offer two distinct ways to run the game. Don't worry, <strong>your worlds are co-accessible</strong>, meaning you can start a world in one mode and play it in the other!</p>
      
      <ul style="margin: 10px 0 20px 20px;">
        <li style="margin-bottom: 10px;">
          <strong>WASM-GC (Default):</strong> Uses WebAssembly for higher performance and smoother gameplay (better FPS). Recommended for most modern computers and Chromebooks.
        </li>
        <li>
          <strong>Standard JS:</strong> A compatibility mode. Use this if the game crashes, fails to load, or if you are on an older device that doesn't support WebAssembly GC. It may have lower FPS but works almost anywhere.
        </li>
      </ul>

      <p>Over <strong>93 million people</strong> have played Minecraft in the browser. Join them now. Start building, exploring, or hop into multiplayer with friends!</p>
      <p>Want to play online with others? Check out community server lists at <a href="https://servers.eaglercraft.com/" target="_blank">servers.eaglercraft.com</a>.</p>
      <p>This browser version is also available offline in our <a href="/apps/reborn-xp/"><strong>Reborn XP simulator</strong></a> via the App Market.</p>
      
      <div style="text-align: center; margin-top: var(--space-4);">
        <img src="https://archive.quenq.com/images/controls.svg" alt="Controls" loading="lazy" draggable="false" style="max-width: 100%; height: auto;" />
      </div>
    </div>
  );

  return (
    <>
      <AppPlayerPage
        user={user}
        appName="Minecraft"
        pageTitle="Play Minecraft Free Online - Browser Edition"
        seoDescription="Play Minecraft instantly in your browser - no downloads, no Java, just pure blocky fun on any device. Singleplayer & multiplayer!"
        iframeSrc="https://archive.quenq.com/apps/minecraft/app.html"
        aspectWidth={16}
        aspectHeight={10}
        controlsExtra={controlsExtra}
        fullDescriptionNode={fullDescriptionNode}
      />

      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', () => {
          const iframe = document.getElementById('app-iframe');
          const modeBtn = document.getElementById('mode-toggle-btn');
          const modeDisplay = document.getElementById('current-mode-display');
          let currentMode = localStorage.getItem('minecraft_pref_mode') || 'wasm';

          function applyMode() {
            if (!iframe) return;
            if (currentMode === 'wasm') {
              iframe.src = 'https://archive.quenq.com/apps/minecraft/app.html';
              if (modeDisplay) modeDisplay.innerText = 'Running in: WASM-GC Mode (Performance)';
              if (modeBtn) modeBtn.innerText = 'Switch to JS Mode';
            } else {
              iframe.src = 'https://archive.quenq.com/apps/minecraft/app-js.html';
              if (modeDisplay) modeDisplay.innerText = 'Running in: Standard JS Mode (Compatibility)';
              if (modeBtn) modeBtn.innerText = 'Switch to WASM Mode';
            }
          }

          applyMode();

          if (modeBtn) {
            modeBtn.addEventListener('click', (e) => {
              e.preventDefault();
              currentMode = currentMode === 'wasm' ? 'js' : 'wasm';
              localStorage.setItem('minecraft_pref_mode', currentMode);
              applyMode();
            });
          }
        });
      `}} />
    </>
  );
}