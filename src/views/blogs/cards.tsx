import type { CurrentUser } from "../../currentUser.js";
import type { BlogListItem } from "../../models.js";
import { blogPath, profilePath } from "../../paths.js";
import { defaultBlogCategory, blogCategories } from "../../policy.js";
import { plainTextFromHtml } from "../../server/security/html.js";
import { Layout, PageFrame, SplitLayout, SplitPane, type PageSeo } from "../../shell/index.js";
import { truncateText } from "../../text.js";
import { MetaSubjectLink } from "../../ui/meta.js";
import { LocalizedTime } from "../../ui/time.js";
import { sqlite } from "../../server/db/client.js";
import { ActionLabel } from "../../ui/actions.js";

export function BlogListPage(props: { user: CurrentUser | null; title: string; blogs: BlogListItem[]; seo?: PageSeo }) {
  const currentCategory = props.title.startsWith("Blogs in ") ? props.title.replace("Blogs in ", "") : null;

  const categoryCounts = sqlite.prepare(
    `SELECT b.category, COUNT(*) AS count 
     FROM blogs b 
     JOIN users u ON u.id = b.author_id 
     JOIN profiles p ON p.user_id = u.id 
     WHERE b.privacy_level = 0 AND u.banned_at IS NULL AND p.private = 0 
     GROUP BY b.category`
  ).all() as Array<{ category: string; count: number }>;

  const totalCount = (sqlite.prepare(
    `SELECT COUNT(*) AS count 
     FROM blogs b 
     JOIN users u ON u.id = b.author_id 
     JOIN profiles p ON p.user_id = u.id 
     WHERE b.privacy_level = 0 AND u.banned_at IS NULL AND p.private = 0`
  ).get() as { count: number }).count;

  const countMap = new Map(categoryCounts.map((c) => [c.category, c.count]));

  return (
    <Layout title={props.title} user={props.user} seo={props.seo}>
      <PageFrame 
        width="wide" 
        title={props.title}
        actions={
          props.user ? (
            <a class="button" href="/blog/new">
              <ActionLabel action="add">Create blog entry</ActionLabel>
            </a>
          ) : null
        }
      >
        <SplitLayout variant="article">
          
          <SplitPane area="aside">
            <div class="context-card">
              <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
                <li>
                  <a href="/blog">
                    {!currentCategory ? <strong>All entries ({totalCount})</strong> : `All entries (${totalCount})`}
                  </a>
                </li>
                {blogCategories.map((category) => {
                  const count = countMap.get(category) ?? 0;
                  return (
                    <li key={category}>
                      <a href={`/blog/category/${encodeURIComponent(category)}`}>
                        {currentCategory === category ? <strong>{category} ({count})</strong> : `${category} (${count})`}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </SplitPane>

          <SplitPane area="main">
            <BlogCardList blogs={props.blogs} empty="No blog entries found." />
          </SplitPane>

        </SplitLayout>
      </PageFrame>
    </Layout>
  );
}

export function BlogCardList(props: { blogs: BlogListItem[]; empty: string }) {
  return (
    <>
      {props.blogs.length ? props.blogs.map((blog) => <BlogCard blog={blog} />) : <p><i>{props.empty}</i></p>}
    </>
  );
}

function BlogCard(props: { blog: BlogListItem }) {
  const blog = props.blog;
  return (
    <div class="content-card">
      <h3><a href={blogPath(blog)}>{blog.title}</a> <small class="blog-card__category">{blog.category ?? defaultBlogCategory}</small></h3>
      {blog.username && blog.authorHandle ? (
        <p class="card-attribution">
          By <MetaSubjectLink href={profilePath(blog.authorHandle)}>{blog.username}</MetaSubjectLink>
          {" · "}
          <LocalizedTime value={blog.createdAt} />
        </p>
      ) : null}
      <p>{truncateText(plainTextFromHtml(blog.bodyHtml), 180)}</p>
    </div>
  );
}