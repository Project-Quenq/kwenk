import type { CurrentUser } from "../../currentUser.js";
import { AppPlayerPage } from "./appShared.js";

export function renderPinballPage(user: CurrentUser | null) {
  const fullDescriptionNode = (
    <div>
      <p style="margin-top: 0;">It is the game everyone remembers but nobody knows how to install anymore. <em>3D Pinball for Windows: Space Cadet</em> was originally bundled with Windows 95 Plus! and later included in Windows NT, ME, 2000, and XP. It was tragically removed in Vista, leaving millions of players without their favorite time-waster.</p>
      <p>We have preserved the game using a faithful web port of the original code. This means the physics, the sounds, the hidden tests, and the gameplay are exactly as you remember them from your childhood PC.</p>
      <p>Mobile Friendly! Playing on a smartphone or tablet? Our emulator automatically detects touch devices and injects custom on-screen controls, giving you Left and Right flippers, a Plunger, and Table Tilt right at your fingertips.</p>
      <p>You can play 3D Pinball Space Cadet right here in your browser, no installation required. It is also available as a built-in app inside our <a href="/apps/reborn-xp/">Reborn XP simulator</a> if you want the full desktop experience!</p>
    </div>
  );

  return (
    <AppPlayerPage
      user={user}
      appName="3D Pinball: Space Cadet"
      pageTitle="Play 3D Pinball Space Cadet Online"
      seoDescription="Play the legendary 3D Pinball Space Cadet for free in your browser. The original Windows XP classic, faithfully restored. Now fully playable in your browser!"
      iframeSrc="https://archive.quenq.com/apps/3d-pinball-space-cadet/app.html"
      aspectWidth={4}
      aspectHeight={3}
      fullDescriptionNode={fullDescriptionNode}
    />
  );
}