import type { CommentItem, PostItem } from "../../models.js";
import { anchors } from "../../anchors.js";
import type { CurrentUser } from "../../currentUser.js";
import { CommentForm, CommentList } from "../../ui/comments.js";
import { Panel } from "../../ui/panels.js";
import { postCommentsPath } from "../../paths.js";

export function PostComments(props: { user: CurrentUser | null; csrf: string; post: PostItem; comments: CommentItem[]; canInteract: boolean }) {
  const commentActionPrompt = props.user ? (
    props.canInteract ? (
      <CommentForm action={postCommentsPath(props.post)} csrf={props.csrf} />
    ) : (
      <p><i>{props.post.groupId ? "Join the group to comment." : "You cannot comment on this post."}</i></p>
    )
  ) : (
    <p><i><a href="/login">Log in</a> or <a href="/signup">sign up</a> to leave a comment.</i></p>
  );

  return (
    <Panel className="post-comments comments-panel" id={anchors.comments} title="Comments" tone="soft">
      {commentActionPrompt}
      <CommentList
        comments={props.comments}
        user={props.user}
        csrf={props.csrf}
        deleteOwnerIds={postCommentDeleteOwnerIds(props.post)}
        deleteAction="/p/comments"
        replyAction={props.user && props.canInteract ? postCommentsPath(props.post) : undefined}
        reportType="post_comment"
      />
    </Panel>
  );
}

function postCommentDeleteOwnerIds(post: PostItem) {
  return [post.authorId, post.wallUserId, post.groupOwnerId].filter((id): id is number => id !== null);
}
