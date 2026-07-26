import type { CurrentUser } from "../../currentUser.js";
import { AppPlayerPage } from "./appShared.js";

export function renderRebornXpPage(user: CurrentUser | null) {
  const fullDescriptionNode = (
    <div>
      <p style="margin-top: 0;"><strong>Reborn XP is our flagship experience and the most accurate Windows XP simulator online.</strong> It is a meticulously crafted, high-fidelity simulation that replicates the real operating system with true 1:1 pixel-perfect accuracy in every single detail. No other project has ever come this close.</p>
      <p>Every sound, animation, theme, and app, from the Start Menu to the file system, is recreated exactly as it was in the early 2000s. It runs instantly and smoothly in your browser, no installation required.</p>
      
      <p style="font-weight: bold; margin-top: var(--space-4);">What's Included in the Experience:</p>
      <ul style="margin-bottom: var(--space-4); padding-left: var(--space-6);">
        <li style="margin-bottom: 8px;"><strong>A Complete Desktop Experience:</strong> An interactive desktop with the exact Start Menu, taskbar, system tray, window animations, and draggable icons.</li>
        <li style="margin-bottom: 8px;"><strong>Every Official Theme:</strong> Perfectly recreated themes including Luna (Blue, Silver, Olive), Royale (Blue, Noir), Zune, Watercolor, and the complete Classic set.</li>
        <li style="margin-bottom: 8px;"><strong>All Original Classic Apps:</strong> Use 1:1 recreations of Paint, Notepad, WordPad, Calculator, Minesweeper, Solitaire, 3D Pinball, Windows Media Player (with skins), Command Prompt, and more.</li>
        <li style="margin-bottom: 8px;"><strong>Original MSN Messenger:</strong> Chat with working bots, send nudges and winks, and use the full set of original emoticons.</li>
        <li style="margin-bottom: 8px;"><strong>Persistent Virtual File System:</strong> Features C:, D:, and E: drives. Upload your own photos, music, and documents by dragging them onto the desktop, and they will stay saved privately in your browser.</li>
        <li style="margin-bottom: 8px;"><strong>Built-in App Market:</strong> Install extra apps and games directly from inside XP, including fan-favorites like BonziBuddy, a working Flash Player, and BootSkin XP.</li>
        <li style="margin-bottom: 8px;"><strong>Multiple User Accounts:</strong> Create and switch between different user accounts, each with its own password and settings, just like the real OS.</li>
      </ul>
      <p>Whether you want to relive the golden era of computing, run retro games, prank your friends, or just enjoy that pure early-2000s desktop feeling, Reborn XP is the most complete and authentic Windows XP experience available anywhere.</p>
    </div>
  );

  return (
    <AppPlayerPage
      user={user}
      appName="Reborn XP"
      pageTitle="Reborn XP - The Ultimate Online Windows XP Simulator"
      seoDescription="Experience the most feature-complete, interactive Windows XP simulator online. Fully functional with classic apps like Windows Media Player and MSN Messenger, a persistent file system, and an App Store, all in your browser."
      iframeSrc="https://xp.quenq.com"
      aspectWidth={16}
      aspectHeight={10}
      fullDescriptionNode={fullDescriptionNode}
    />
  );
}