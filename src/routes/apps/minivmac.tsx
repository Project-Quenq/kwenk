import type { CurrentUser } from "../../currentUser.js";
import { AppPlayerPage } from "./appShared.js";

export function renderMinivmacPage(user: CurrentUser | null) {
  const fullDescriptionNode = (
    <div>
      <p style="margin-top: 0;"><strong>Go back to the beginning of the GUI revolution.</strong> This is a fully functional emulation of a classic Macintosh computer running System 7, powered by the Mini vMac project and compiled to WebAssembly. This technology allows it to run efficiently and accurately in your browser.</p>
      <p>Experience the authentic black-and-white interface, iconic applications, and the foundational design that influenced every graphical operating system that followed.</p>
      <p>If you enjoy this, you'll love our flagship project: a complete simulation of a much more modern OS, <a href="/apps/reborn-xp/">Reborn XP</a>.</p>
    </div>
  );

  return (
    <AppPlayerPage
      user={user}
      appName="Macintosh Classic"
      pageTitle="Online Macintosh Classic Emulator (System 7)"
      seoDescription="Experience the dawn of the GUI with this WebAssembly-powered emulation of Apple's classic Macintosh OS. See where modern computing began, right in your browser."
      iframeSrc="https://archive.quenq.com/apps/minivmac/MinivMac.htm"
      aspectWidth={4}
      aspectHeight={3}
      fullDescriptionNode={fullDescriptionNode}
    />
  );
}