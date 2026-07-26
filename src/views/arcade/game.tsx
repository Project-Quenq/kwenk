import type { CurrentUser } from "../../currentUser.js";
import type { CommentItem, GameItem } from "../../models.js";
import { Layout, PageFrame, SplitLayout, SplitPane } from "../../shell/index.js";
import { Panel } from "../../ui/panels.js";
import { CommentPanel } from "../../ui/comments.js";
import { PropAction, PropCount } from "../../ui/engagement.js";
import { Icon } from "../../ui/icons.js";
import { AdBanner } from "../home/infoPanels.js";

type GamePageProps = {
  user: CurrentUser | null;
  csrf: string;
  game: GameItem;
  comments: CommentItem[];
  relatedGames: GameItem[];
  genres: string[];
};

export function GamePlayPage(props: GamePageProps) {
  const game = props.game;
  const slug = game.url.split("/").pop() ?? "";
  const cdnIframeSrc = `https://archive.quenq.com/arcade/data/${game.url}/`;
  const canonicalPath = `/arcade/${slug}`;

  const metaDescription = game.description.replace(/\s+/g, " ").trim();

  const engagementActions = (
    <>
      {props.user ? (
        <PropAction
          action={`/arcade/${slug}/${game.proppedByViewer ? "unprop" : "prop"}`}
          csrf={props.csrf}
          count={game.propsCount}
          propped={Boolean(game.proppedByViewer)}
        />
      ) : (
        <PropCount count={game.propsCount} />
      )}
      <a href="#comments" class="button button--secondary">
        <Icon name="comment" /> {game.commentCount} {game.commentCount === 1 ? "Comment" : "Comments"}
      </a>
    </>
  );

  const utilityActions = (
    <button id="fullscreen-btn" class="button" style="cursor: pointer;">
      <Icon name="fullscreen" /> Fullscreen
    </button>
  );

  return (
    <Layout
      title={`Play ${game.name} Online | Free Flash Game | Quenq`}
      user={props.user}
      seo={{
        canonicalPath,
        description: metaDescription,
        type: "video.other",
        imagePath: `https://archive.quenq.com/arcade/data/${game.thumbnail}`
      }}
    >
      <PageFrame width="wide" title={`Play ${game.name} Online`}>
        
        <Panel title={game.name} tone="strong">
          <div style={`width: 100%; max-width: ${game.width}px; margin: 0 auto;`}>
            <iframe 
              id="game-iframe"
              src={cdnIframeSrc}
              title={`${game.name} Game Player`}
              style={`aspect-ratio: ${game.width} / ${game.height}; width: 100%; border: none; background-color: #171c20; border-radius: var(--radius-panel);`}
              allowfullscreen={true}
            ></iframe>
            
            <div style="margin-top: var(--space-4); display: flex; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3);">
              <div style="display: flex; gap: var(--space-2);">{engagementActions}</div>
              <div style="display: flex; gap: var(--space-2);">{utilityActions}</div>
            </div>
          </div>

          <script dangerouslySetInnerHTML={{ __html: `
            document.addEventListener('DOMContentLoaded', () => {
              const btn = document.getElementById('fullscreen-btn');
              const iframe = document.getElementById('game-iframe');
              if (btn && iframe) {
                btn.addEventListener('click', (e) => {
                  e.preventDefault();
                  if (iframe.requestFullscreen) { 
                    iframe.requestFullscreen(); 
                  } else if (iframe.webkitRequestFullscreen) { 
                    iframe.webkitRequestFullscreen(); 
                  }
                  if ('keyboard' in navigator && 'lock' in navigator.keyboard) {
                    navigator.keyboard.lock(['Escape']).catch(() => {});
                  }
                });
              }
            });
          `}} />
        </Panel>

        <SplitLayout variant="article">
          
          <SplitPane area="aside">
            <div class="context-card">
              <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
                <li><a href="/arcade">All Games</a></li>
                {props.genres.map((genre) => (
                  <li key={genre}>
                    <a href={`/arcade?genre=${encodeURIComponent(genre.toLowerCase())}`} style="text-transform: capitalize;">
                      {genre}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <AdBanner />
          </SplitPane>

          <SplitPane area="main">
            
            <Panel title={`About ${game.name}`} tone="soft">
              <p style="white-space: pre-line;">{game.description}</p>
            </Panel>

            <CommentPanel
              user={props.user}
              csrf={props.csrf}
              comments={props.comments}
              action={`/arcade/${slug}/comments`}
              deleteOwnerIds={[]}
              deleteAction="/arcade/comments"
              reportType="game_comment"
            />

            <AdBanner />

            <Panel title="You Might Also Like..." tone="soft">
              {props.relatedGames.length ? (
                <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4); width: 100%;">
                  {props.relatedGames.map((related) => {
                    const relatedSlug = related.url.split("/").pop() ?? "";
                    const relatedThumbnail = `https://archive.quenq.com/arcade/data/${related.thumbnail}`;
                    return (
                      <article key={related.id} class="content-card" style="padding: 0; border-radius: var(--radius-panel); overflow: hidden;">
                        <a 
                          href={`/arcade/${relatedSlug}`}
                          style={`display: block; width: 100%; aspect-ratio: 16 / 10; background-image: url('${relatedThumbnail}'); background-size: cover; background-position: center; position: relative; text-decoration: none;`}
                        >
                          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); padding: var(--space-2); text-align: center;">
                            <p style="margin: 0; color: white; font-size: 10px; font-weight: bold; overflow-wrap: anywhere;">{related.name}</p>
                          </div>
                        </a>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p><i>Check back later for more recommendations!</i></p>
              )}
            </Panel>

          </SplitPane>

        </SplitLayout>
      </PageFrame>
    </Layout>
  );
}