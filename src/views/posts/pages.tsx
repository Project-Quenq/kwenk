import type { CommentItem, PostItem } from "../../models.js";
import type { CurrentUser } from "../../currentUser.js";
import { profilePath } from "../../paths.js";
import { BackLink, BackToPage } from "../../ui/links.js";
import { PaginationNav } from "../../ui/pagination.js";
import { Layout, PageFrame, type PageSeo } from "../../shell/index.js";
import { AuthorSkinStyles } from "../../skins/rendering.js";
import { PostCard, PostList } from "./cards.js";
import { PostComments } from "./comments.js";
import { PostComposer } from "./composer.js";

export function FeedPage(props: {
  user: CurrentUser | null;
  csrf: string;
  posts: PostItem[];
  nextHref?: string | null;
  resetHref?: string | null;
  seo?: PageSeo;
}) {
  return (
    <Layout title="Feed" user={props.user} head={<AuthorSkinStyles items={props.posts} />} seo={props.seo}>
      <PageFrame title="Feed">
        {props.user ? (
          <PostComposer action="/feed" csrf={props.csrf} button="Post" />
        ) : (
          <p class="card-attribution" style="margin-bottom: var(--space-4);">
            <i><a href="/login">Log in</a> or <a href="/signup">sign up</a> to share updates, join discussions, and prop posts.</i>
          </p>
        )}
        <PostList user={props.user} csrf={props.csrf} posts={props.posts} empty="No posts yet." />
        <PaginationNav nextHref={props.nextHref} nextLabel="Older posts" resetHref={props.resetHref} resetLabel="Newest posts" />
      </PageFrame>
    </Layout>
  );
}

export function PostPage(props: {
  user: CurrentUser | null;
  csrf: string;
  post: PostItem;
  comments: CommentItem[];
  canInteract: boolean;
  seo?: PageSeo;
}) {
  const back = props.user
    ? <BackToPage page="feed" />
    : <BackLink href={profilePath(props.post.authorHandle)} label={`${props.post.username}'s profile`} />;

  return (
    <Layout
      title={`${props.post.username}'s Post`}
      user={props.user}
      head={<AuthorSkinStyles items={[props.post, ...props.comments]} />}
      seo={props.seo}
    >
      <PageFrame back={back}>
        <PostCard user={props.user} csrf={props.csrf} post={props.post} canInteract={props.canInteract} />
        <PostComments user={props.user} csrf={props.csrf} post={props.post} comments={props.comments} canInteract={props.canInteract} />
      </PageFrame>
    </Layout>
  );
}
