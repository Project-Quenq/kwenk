import type { CurrentUser } from "../../currentUser.js";
import { AppPlayerPage } from "./appShared.js";

export function renderSwfPlayerPage(user: CurrentUser | null) {
  const fullDescriptionNode = (
    <div>
      <p style="margin-top: 0;">This tool uses the power of Ruffle, a Flash Player emulator written in Rust and WebAssembly, to bring .swf files back to life in the modern browser. Adobe Flash was the backbone of internet creativity for over a decade, and this player ensures that countless classic games and animations are not lost to time.</p>
      <p>Simply upload any `.swf` file to experience it safely on the web. For a massive library of classic Flash content, we recommend browsing the apps on <a href="https://archive.org/details/softwarelibrary_flash" target="_blank" rel="noopener noreferrer">The Internet Archive</a>.</p>
      <p>Mobile Friendly! Playing on a smartphone or tablet? Our emulator automatically detects touch devices and injects a virtual D-Pad and Action button, allowing you to play classic keyboard-based Flash games on the go.</p>
      <p>Many classic Flash games are also available to play instantly in the <a href="/arcade/">Quenq Arcade</a>!</p>
    </div>
  );

  return (
    <AppPlayerPage
      user={user}
      appName="SWF Flash Player"
      pageTitle="Online SWF Player (Flash Emulator)"
      seoDescription="The legacy of Adobe Flash lives on. Upload any .swf file and our Ruffle-powered player will run it, preserving classic animations and games for the modern web."
      iframeSrc="https://archive.quenq.com/apps/swf-player/app.html"
      aspectWidth={16}
      aspectHeight={10}
      fullDescriptionNode={fullDescriptionNode}
    />
  );
}