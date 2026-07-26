import type { BlogListItem, GameItem, PostItem } from "../../models.js";
import type { CurrentUser } from "../../currentUser.js";
import { Layout, PageFrame } from "../../shell/index.js";
import { AuthorSkinStyles } from "../../skins/rendering.js";
import { BlogCardList } from "../blogs/index.js";
import { PostList } from "../posts/index.js";

export function PropsPage(props: { user: CurrentUser; csrf: string; posts: PostItem[]; blogs: BlogListItem[]; games: GameItem[] }) {
  return (
    <Layout title="Your props" user={props.user} head={<AuthorSkinStyles items={props.posts} />}>
      <PageFrame title="Your props">
        <p>Posts, blog entries, and arcade games you give props to show up here.</p>

        <h2>Posts</h2>
        <PostList user={props.user} csrf={props.csrf} posts={props.posts} empty="No propped posts yet." />
        
        <h2>Blog entries</h2>
        <BlogCardList blogs={props.blogs} empty="No propped blog entries yet." />

        <h2>Arcade games</h2>
        {props.games && props.games.length ? (
          <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4); width: 100%;">
            {props.games.map((game) => {
              const slug = game.url.split("/").pop() ?? "";
              const cdnThumbnail = `https://archive.quenq.com/arcade/data/${game.thumbnail}`;
              return (
                <article key={game.id} class="content-card" style="padding: 0; border-radius: var(--radius-panel); overflow: hidden;">
                  <a 
                    href={`/arcade/${slug}`}
                    style={`display: block; width: 100%; aspect-ratio: 16 / 10; background-image: url('${cdnThumbnail}'); background-size: cover; background-position: center; position: relative; text-decoration: none;`}
                  >
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); padding: var(--space-2); text-align: center;">
                      <p style="margin: 0; color: white; font-size: 10px; font-weight: bold; overflow-wrap: anywhere;">{game.name}</p>
                    </div>
                  </a>
                </article>
              );
            })}
          </div>
        ) : (
          <p><i>No propped games yet.</i></p>
        )}
      </PageFrame>
    </Layout>
  );
}