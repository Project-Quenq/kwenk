import type { CurrentUser } from "../../currentUser.js";
import { AppPlayerPage } from "./appShared.js";

export function renderEmulatorPage(user: CurrentUser | null) {
  const fullDescriptionNode = (
    <div>
      <p style="margin-top: 0;"><strong>Relive gaming history.</strong> This powerful tool, powered by EmulatorJS, brings a vast array of classic 8-bit, 16-bit, and early 3D consoles right to your browser. It supports systems like the NES, SNES, Sega Genesis, PlayStation (PS1), N64, and many more.</p>
      <p>To get started, simply drag and drop your legally-owned game ROM file onto the application window above.</p>
    </div>
  );

  return (
    <AppPlayerPage
      user={user}
      appName="Console Emulator"
      pageTitle="Online Console Emulator (NES, SNES, N64, PSX)"
      seoDescription="Play classic console games online. Our browser-based emulator supports NES, SNES, Genesis, PlayStation (PS1), N64 and more. Just upload your ROM file and start playing."
      iframeSrc="https://archive.quenq.com/apps/emulator/app.html"
      aspectWidth={4}
      aspectHeight={3}
      fullDescriptionNode={fullDescriptionNode}
    />
  );
}