import type { CurrentUser } from "../../currentUser.js";
import type { GameItem } from "../../models.js";
import { limits } from "../../policy.js";
import { Layout, PageFrame, SplitLayout, SplitPane } from "../../shell/index.js";
import { ArcadePagination } from "../../ui/arcadePagination.js";
import { ActionLabel } from "../../ui/actions.js";
import { AdBanner } from "../home/infoPanels.js";

type ArcadePageProps = {
  user: CurrentUser | null;
  csrf: string;
  games: GameItem[];
  genres: string[];
  currentPage: number;
  totalPages: number;
  currentGenre: string;
  currentSearch: string;
};

export function ArcadeListPage(props: ArcadePageProps) {
  const matchedGenre = props.genres.find(
    (g) => g.toLowerCase() === props.currentGenre.toLowerCase()
  );
  const formattedGenre = matchedGenre || (props.currentGenre ? props.currentGenre.charAt(0).toUpperCase() + props.currentGenre.slice(1) : "All");

  const isFilteredByGenre = props.currentGenre && props.currentGenre.toLowerCase() !== "all";

  const seoDescription = isFilteredByGenre
    ? `Browse and play classic ${formattedGenre} Flash games instantly in your browser at the Quenq Arcade.`
    : "Enter the Quenq Arcade, a massive, curated library of the best free emulated Flash games. Play nostalgic classics from a golden era of browser gaming, instantly.";

  const pageTitle = isFilteredByGenre
    ? `${formattedGenre} Games`
    : "Arcade";

  const canonicalPath = props.currentPage > 1
    ? `/arcade?page=${props.currentPage}`
    : "/arcade";

  return (
    <Layout
      title={`${pageTitle} - Play Free Classic Flash Games | Quenq`}
      user={props.user}
      seo={{
        canonicalPath,
        description: seoDescription,
        type: "website"
      }}
    >
      <PageFrame width="wide" title={pageTitle}>
        
        <p> Welcome to the ultimate destination for classic Flash gaming. Relive the golden era of browser games with a library of over <strong>1,300 legendary titles</strong>, carefully preserved and fully emulated to run seamlessly in modern web browsers. No plugins or downloads required. Whether you're revisiting old favorites or discovering timeless classics for the first time, every game is ready to play instantly in your browser. </p>

        <SplitLayout variant="article">
          
          <SplitPane area="aside">
            <div class="context-card">
              <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
                <li>
                  <a href="/arcade" style={!isFilteredByGenre ? "font-weight: bold;" : undefined}>
                    All Games
                  </a>
                </li>
                {props.genres.map((genre) => {
                  const isSelected = props.currentGenre.toLowerCase() === genre.toLowerCase();
                  return (
                    <li key={genre}>
                      <a
                        href={`/arcade?genre=${encodeURIComponent(genre.toLowerCase())}`}
                        style={isSelected ? "font-weight: bold; text-transform: capitalize;" : "text-transform: capitalize;"}
                      >
                        {genre}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <AdBanner />
          </SplitPane>

          <SplitPane area="main">
            
            <form method="get" action="/arcade" class="search-form">
              <input 
                type="text" 
                name="search" 
                value={props.currentSearch} 
                placeholder="Search games..."
                maxLength={limits.searchQuery} 
                autocomplete="off" 
              />
              {isFilteredByGenre ? <input type="hidden" name="genre" value={props.currentGenre} /> : null}
              <button type="submit"><ActionLabel action="search">Search</ActionLabel></button>
            </form>

            {props.games.length ? (
              <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-5); width: 100%;">
                {props.games.map((game) => {
                  const slug = game.url.split("/").pop() ?? "";
                  const cdnThumbnail = `https://archive.quenq.com/arcade/data/${game.thumbnail}`;
                  return (
                    <article key={game.id} class="content-card" style="padding: 0; overflow: hidden;">
                      <a 
                        href={`/arcade/${slug}`}
                        style={`display: block; width: 100%; aspect-ratio: 16 / 10; background-image: url('${cdnThumbnail}'); background-size: cover; background-position: center; position: relative; text-decoration: none;`}
                      >
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); padding: var(--space-2); text-align: center;">
                          <p style="margin: 0; color: white; font-size: 11px; font-weight: bold; overflow-wrap: anywhere;">{game.name}</p>
                        </div>
                      </a>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p><i>No games found matching your criteria.</i></p>
            )}

            <ArcadePagination
              currentPage={props.currentPage}
              totalPages={props.totalPages}
              genre={props.currentGenre}
              searchQuery={props.currentSearch}
            />

            <AdBanner />
          </SplitPane>

        </SplitLayout>
      </PageFrame>
    </Layout>
  );
}