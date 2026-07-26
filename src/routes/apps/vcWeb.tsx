import type { CurrentUser } from "../../currentUser.js";
import { AppPlayerPage } from "./appShared.js";

export function renderVcWebPage(user: CurrentUser | null) {
  const fullDescriptionNode = (
    <div>
      <p style="margin-top: 0;">VC Web Edition brings the legendary open world experience of 1986 Miami directly into your browser. Set in a sprawling, neon-soaked metropolis inspired by 1980s Miami, VC stands as one of the most iconic environments in gaming history.</p>
      <p>The story follows Tom, a mobster recently released from prison after serving fifteen years. He is sent to the city by his former boss Son Forella to oversee a drug deal. When the deal is ambushed and both the money and the drugs are lost, Tom is left to pick up the pieces.</p>
      <p>As he works to recover what was lost and answer to the Forella family, Tom becomes involved with the city's various criminal organizations and power players. Over time, he builds his own network of businesses and influence, ultimately rising to control the city's criminal underworld.</p>
      <p style="font-weight: bold;">Key Features:</p>
      <ul style="margin-bottom: var(--space-4); padding-left: var(--space-6);">
        <li style="margin-bottom: 6px;"><strong>Integrated Save Manager:</strong> Upload your existing .b save files from a PC or PS2 to resume progress, or download backups.</li>
        <li style="margin-bottom: 6px;"><strong>Instant Access:</strong> No large initial downloads. The WebAssembly engine loads in seconds and streams the map as you drive.</li>
        <li style="margin-bottom: 6px;"><strong>Cross-Platform Support:</strong> Play with keyboard and mouse on desktop or touch controls on mobile.</li>
      </ul>

      <p>There is a specific memory that defines gaming in the early 2000s. You're sitting in front of a bulky CRT monitor. The room glows with neon pink light from the screen. A crumpled piece of printer paper sits on your desk, covered in handwritten scribbles.</p>
      
      <b>The Essentials</b>
<p>These are the ones you used constantly to stay alive in a tough game.</p>
<ul>
<li><strong>ASPIRINE</strong>: Restores full health. Works even if your car is on fire and you're inside it.</li>
<li><strong>PRECIOUSPROTECTION</strong>: Refills your armor completely.</li>
<li><strong>LEAVEMEALONE</strong>: Removes your wanted level entirely.</li>
<li><strong>YOUWONTTAKEMEALIVE</strong>: Raises your wanted level by two stars.</li>
</ul>
<b>Weapon Sets</b>
<p>Why hunt for guns when you can spawn them instantly?</p>
<ul>
<li><strong>THUGSTOOLS</strong>: Weapon Set 1. Basic thug kit including brass knuckles and Molotovs.</li>
<li><strong>PROFESSIONALTOOLS</strong>: Weapon Set 2. Standard loadout with revolver, Uzi, and more.</li>
<li><strong>NUTTERTOOLS</strong>: Weapon Set 3. Heavy artillery including minigun and rocket launcher.</li>
</ul>
<b>Spawning Vehicles</b>
<p>Walking is for civilians. Real players drive in style.</p>
<ul>
<li><strong>PANZER</strong>: Spawns a Rhino Tank. Arguably the most famous cheat code ever.</li>
<li><strong>TRAVELINSTYLE</strong>: Spawns a Bloodring Banger.</li>
<li><strong>GETTHEREQUICKLY</strong>: Spawns the alternate Bloodring Banger.</li>
<li><strong>GETTHEREFAST</strong>: Spawns a Sabre Turbo.</li>
<li><strong>GETTHEREVERYFASTINDEED</strong>: Spawns a Hotring Racer.</li>
<li><strong>GETTHEREAMAZINGLYFAST</strong>: Spawns the alternate Hotring Racer.</li>
<li><strong>THELASTRIDE</strong>: Spawns Romero's Hearse.</li>
<li><strong>ROCKANDROLLCAR</strong>: Spawns the Love Fist Limousine.</li>
<li><strong>RUBBISHCAR</strong>: Spawns a Trashmaster garbage truck.</li>
<li><strong>BETTERTHANWALKING</strong>: Spawns a Golf Caddie.</li>
</ul>
<b>Gameplay &amp; World Modifiers</b>
<p>Sometimes the city itself needs tweaking. These codes alter physics, traffic, and the world around you.</p>
<ul>
<li><strong>BIGBANG</strong>: Blows up all nearby vehicles. Instant panic button.</li>
<li><strong>SEAWAYS</strong>: Cars drive on water. Perfect for quick island hops.</li>
<li><strong>COMEFLYWITHME</strong>: Flying cars with low gravity. Vehicles glide and float.</li>
<li><strong>GRIPISEVERYTHING</strong>: Perfect handling. Sharper turning and braking.</li>
<li><strong>GREENLIGHT</strong>: All traffic lights stay green. No more waiting.</li>
<li><strong>MIAMITRAFFIC</strong>: Aggressive drivers. Road rage everywhere.</li>
<li><strong>AHAIRDRESSERSCAR</strong>: All cars turn pink.</li>
<li><strong>IWANTITPAINTEDBLACK</strong>: All cars turn black.</li>
<li><strong>WHEELSAREALLINEED</strong>: Invisible cars. Only the wheels remain visible.</li>
<li><strong>LOADSOFLITTLETHINGS</strong>: Sports cars get oversized wheels.</li>
<li><strong>LIFEISPASSINGMEBY</strong>: Speeds up the in-game clock.</li>
<li><strong>ONSPEED</strong>: Makes gameplay faster overall.</li>
<li><strong>BOOOOOORING</strong>: Slows down gameplay for bullet-time effect.</li>
<li><strong>CERTAINDEATH</strong>: Tommy lights and smokes a cigarette.</li>
</ul>
<b>Police &amp; Pedestrians</b>
<p>Control the streets and the people on them. Warning: Riot mode can't be turned off without reloading.</p>
<ul>
<li><strong>FIGHTFIGHTFIGHT</strong>: Riot mode. Pedestrians fight each other.</li>
<li><strong>NOBODYLIKESME</strong>: Hostile pedestrians. Everyone attacks you.</li>
<li><strong>OURGODGIVENRIGHTTOBEARARMS</strong>: All pedestrians carry weapons.</li>
<li><strong>CHICKSWITHGUNS</strong>: Female pedestrians armed with guns.</li>
<li><strong>FANNYMAGNET</strong>: Women follow you everywhere.</li>
</ul>
<b>Character Skins</b>
<p>Tired of Tom's Hawaiian shirt? Play as other story characters.</p>
<ul>
<li><strong>STILLLIKEDRESSINGUP</strong>: Random outfit change.</li>
<li><strong>LOOKLIKELANCE</strong>: Play as Dance Vance.</li>
<li><strong>MYSONISALAWYER</strong>: Play as Zen Rosenberg.</li>
<li><strong>ILOOKLIKEHILARY</strong>: Play as Pilary King.</li>
<li><strong>ROCKANDROLLMAN</strong>: Play as Jezz Torrent.</li>
<li><strong>ONEARMEDBANDIT</strong>: Play as Pill Cassidy.</li>
<li><strong>IDONTHAVETHEMONEYSONNY</strong>: Play as Son Forella.</li>
<li><strong>FOXYLITTLETHING</strong>: Play as BMW Cortez.</li>
<li><strong>CHEATSHAVEBEENCRACKED</strong>: Play as Richard Dias.</li>
</ul>
<b>Weather Control</b>
<p>Set the perfect mood for your rampage.</p>
<ul>
<li><strong>ALOVELYDAY</strong>: Clear sunny weather.</li>
<li><strong>APLEASANTDAY</strong>: Overcast clouds.</li>
<li><strong>ABITDRIEG</strong>: Very cloudy.</li>
<li><strong>CANTSEEATHING</strong>: Thick fog.</li>
<li><strong>CATSANDDOGS</strong>: Stormy rain.</li>
</ul>
    </div>
  );

  return (
    <AppPlayerPage
      user={user}
      appName="VC Web"
      pageTitle="Play VC Online | Free Browser Game"
      seoDescription="Play the complete VC game directly in your browser. VC Web Edition brings the legendary open world experience of 1986 Miami directly into your browser."
      iframeSrc="https://vc.quenq.com"
      aspectWidth={4}
      aspectHeight={3}
      fullDescriptionNode={fullDescriptionNode}
    />
  );
}