import type { CurrentUser } from "../../currentUser.js";
import { AppPlayerPage } from "./appShared.js";

export function renderHackerSimulatorPage(user: CurrentUser | null) {
  const fullDescriptionNode = (
    <div>
      <p style="margin-top: 0;">Also known as hacker typer, this engaging online hacker simulator lets you prank your friends by making it look like you're breaching a secure network. Unlike other simulators, this one is more immersive with its realistic, text-based interface and interactive windows.</p>
      <p>Simply start typing on your keyboard to generate hacker-style code. Use the Start menu within the app to customize the experience, open and minimize windows, and create the perfect scene. It's the ultimate tool for some harmless fun.</p>
    </div>
  );

  return (
    <AppPlayerPage
      user={user}
      appName="Hacker Simulator"
      pageTitle="Online Hacker Simulator Prank | Hacker Typer"
      seoDescription="Look like a real hacker with this realistic, text-based hacking simulator. A fun and interactive prank tool to use with your friends, right in your browser."
      iframeSrc="https://archive.quenq.com/apps/hacker-simulator/app.html"
      aspectWidth={16}
      aspectHeight={10}
      fullDescriptionNode={fullDescriptionNode}
    />
  );
}