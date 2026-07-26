import type { CurrentUser } from "../../currentUser.js";
import { AppPlayerPage } from "./appShared.js";

export function renderAngryBirdsPage(user: CurrentUser | null) {
  const fullDescriptionNode = (
    <div>
      <p style="margin-top: 0;"><strong>The classic you can't find anywhere else.</strong> This is the complete, beloved Angry Birds game originally released for the Google Chrome browser in 2011, a time when web gaming was exploding.</p>
      <p>After being delisted from the Chrome Web Store, this official web version became incredibly difficult to find. We've preserved it here and made it even better. Since the original in-app purchase servers are long offline, we have <strong>modded this version to give you unlimited access to the Mighty Eagle for free.</strong> Clear any level with ease!</p>
      <p>This is the definitive way to experience a piece of web gaming history, fully unlocked and ready to play exclusively on Quenq. It is also available to download directly from the App Market inside our <a href="/apps/reborn-xp">Reborn XP simulator</a>.</p>
    </div>
  );

  return (
    <AppPlayerPage
      user={user}
      appName="Angry Birds Chrome"
      pageTitle="Play Angry Birds Chrome Online"
      seoDescription="Play the classic Angry Birds for Chrome, fully unlocked and modded with unlimited Mighty Eagles. A rare, preserved version of the delisted web game, only on Quenq."
      iframeSrc="https://archive.quenq.com/apps/angry-birds-chrome/app.html"
      aspectWidth={840}
      aspectHeight={480}
      fullDescriptionNode={fullDescriptionNode}
    />
  );
}