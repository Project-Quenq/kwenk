import type { CurrentUser } from "../../currentUser.js";
import type { GameItem } from "../../models.js";
import { limits } from "../../policy.js";
import { Layout, PageFrame, SplitLayout, SplitPane } from "../../shell/index.js";
import { ArcadePagination } from "../../ui/arcadePagination.js";
import { ActionLabel } from "../../ui/actions.js";
import { AdBanner, AdBannerMain } from "../home/infoPanels.js";

type ArcadePageProps = {
  user: CurrentUser | null;
  csrf: string;
  games: GameItem[];
  genres: string[];
  currentPage: number;
  totalPages: number;
  currentGenre: string;
  currentSearch: string;
  currentSort: string;
  hasProppedGames?: boolean;
};

export function ArcadeListPage(props: ArcadePageProps) {
  const isProppedFilter = props.currentGenre === "propped" || props.currentGenre === "props";
  const matchedGenre = props.genres.find(
    (g) => g.toLowerCase() === props.currentGenre.toLowerCase()
  );
  const formattedGenre = isProppedFilter 
    ? "My Props" 
    : matchedGenre || (props.currentGenre ? props.currentGenre.charAt(0).toUpperCase() + props.currentGenre.slice(1) : "All");

  const isFilteredByGenre = props.currentGenre && props.currentGenre.toLowerCase() !== "all";

  const seoDescription = isFilteredByGenre
    ? `Browse and play classic ${formattedGenre} Flash games on Kwenk Arcade. Read community reviews, give props, and play free online.`
    : "Explore the Kwenk Arcade! Play thousands of free classic Flash games, leave reviews, give props, and join community discussions.";

  const pageTitle = isProppedFilter ? "My Props" : isFilteredByGenre ? `${formattedGenre} Games` : "Arcade";

  const canonicalPath = props.currentPage > 1
    ? `/arcade?page=${props.currentPage}`
    : "/arcade";

  const sortUrl = (sort: "popular" | "alphabetical") => {
    const params = new URLSearchParams();
    if (props.currentGenre && props.currentGenre !== "all") params.set("genre", props.currentGenre);
    if (props.currentSearch) params.set("search", props.currentSearch);
    if (sort !== "popular") params.set("sort", sort);
    const query = params.toString();
    return query ? `/arcade?${query}` : "/arcade";
  };

  const sortParam = props.currentSort && props.currentSort !== "popular" ? `&sort=${props.currentSort}` : "";

  return (
    <Layout
      title={`${pageTitle} - Community & Classic Flash Games | Kwenk`}
      user={props.user}
      seo={{
        canonicalPath,
        description: seoDescription,
        type: "website"
      }}
    >
      <PageFrame width="wide" title={pageTitle}>
        
        <p> Welcome to the Kwenk Arcade! Play thousands of classic Flash games directly in your browser. Give props to your favorites, leave comments, share reviews, and join dedicated gaming communities. No plugins or downloads required. </p>

        <SplitLayout variant="article">
          
          <SplitPane area="aside">
            <div class="context-card">
              <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
                <li>
                  <a href={`/arcade${sortParam ? `?${sortParam.slice(1)}` : ""}`} style={!isFilteredByGenre ? "font-weight: bold;" : undefined}>
                    All Games
                  </a>
                </li>

                {props.user && props.hasProppedGames ? (
                  <li>
                    <a href={`/arcade?genre=propped${sortParam}`} style={isProppedFilter ? "font-weight: bold;" : undefined}>
                      My Props
                    </a>
                  </li>
                ) : null}

                {props.genres.map((genre) => {
                  const isSelected = props.currentGenre.toLowerCase() === genre.toLowerCase();
                  return (
                    <li key={genre}>
                      <a
                        href={`/arcade?genre=${encodeURIComponent(genre.toLowerCase())}${sortParam}`}
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
            
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-5);">
              <form method="get" action="/arcade" class="search-form" style="margin: 0; flex: 1 1 auto; max-width: 28rem;">
                <input 
                  type="text" 
                  name="search" 
                  value={props.currentSearch} 
                  placeholder="Search games..."
                  maxLength={limits.searchQuery} 
                  autocomplete="off" 
                />
                {isFilteredByGenre ? <input type="hidden" name="genre" value={props.currentGenre} /> : null}
                {props.currentSort === "alphabetical" ? <input type="hidden" name="sort" value="alphabetical" /> : null}
                <button type="submit"><ActionLabel action="search">Search</ActionLabel></button>
              </form>

              <div style="display: flex; gap: var(--space-2); flex: 0 0 auto;">
                <a href={sortUrl("popular")} class={props.currentSort === "popular" ? "button button--selected" : "button button--secondary"}>
                  Popular
                </a>
                <a href={sortUrl("alphabetical")} class={props.currentSort === "alphabetical" ? "button button--selected" : "button button--secondary"}>
                  A-Z
                </a>
              </div>
            </div>

            {props.games.length ? (
              <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-5); width: 100%;">
                {props.games.map((game) => {
                  const slug = game.url.split("/").pop() ?? "";
                  const cdnThumbnail = `https://quenq.com/arcade/data/${game.thumbnail}`;
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
              sort={props.currentSort}
            />

            <AdBannerMain />
          </SplitPane>

        </SplitLayout>
      </PageFrame>
    </Layout>
  );
}