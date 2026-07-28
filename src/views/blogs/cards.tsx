import type { CurrentUser } from "../../currentUser.js";
import type { BlogListItem, UserProfile } from "../../models.js";
import { blogPath, profilePath } from "../../paths.js";
import { defaultBlogCategory, blogCategories, limits } from "../../policy.js";
import { plainTextFromHtml } from "../../server/security/html.js";
import { Layout, PageFrame, SplitLayout, SplitPane, type PageSeo } from "../../shell/index.js";
import { truncateText } from "../../text.js";
import { MetaSubjectLink } from "../../ui/meta.js";
import { LocalizedTime } from "../../ui/time.js";
import { sqlite } from "../../server/db/client.js";
import { ActionLabel } from "../../ui/actions.js";
import { PaginationNav } from "../../ui/pagination.js";
import { AdBanner, AdBannerMain } from "../home/infoPanels.js";

type BlogListPageProps = {
  user: CurrentUser | null;
  title: string;
  blogs: BlogListItem[];
  basePath?: string;
  currentCategory?: string | null;
  currentSort?: "latest" | "popular";
  currentSearch?: string;
  isUserBlog?: boolean;
  userProfile?: UserProfile;
  nextHref?: string | null;
  resetHref?: string | null;
  seo?: PageSeo;
};

export function BlogListPage(props: BlogListPageProps) {
  const currentSort = props.currentSort ?? "latest";
  const currentSearch = props.currentSearch ?? "";
  const currentCategory = props.currentCategory ?? (props.title.startsWith("Blogs in ") ? props.title.replace("Blogs in ", "") : null);
  
  const basePath = props.basePath ?? (currentCategory ? `/blog/category/${encodeURIComponent(currentCategory)}` : "/blog");

  const categoryUrl = (cat?: string) => {
    const path = cat ? `/blog/category/${encodeURIComponent(cat)}` : "/blog";
    const params = new URLSearchParams();
    if (currentSort === "popular") params.set("sort", "popular");
    if (currentSearch) params.set("q", currentSearch);
    const query = params.toString();
    return query ? `${path}?${query}` : path;
  };

  const sortUrl = (sort: "latest" | "popular") => {
    const params = new URLSearchParams();
    if (sort === "popular") params.set("sort", "popular");
    if (currentSearch) params.set("q", currentSearch);
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

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
                  <a href={categoryUrl()}>
                    {!currentCategory ? <strong>All entries ({totalCount})</strong> : `All entries (${totalCount})`}
                  </a>
                </li>
                {blogCategories.map((category) => {
                  const count = countMap.get(category) ?? 0;
                  return (
                    <li key={category}>
                      <a href={categoryUrl(category)}>
                        {currentCategory === category ? <strong>{category} ({count})</strong> : `${category} (${count})`}
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
              <form method="get" action={basePath} class="search-form" style="margin: 0; flex: 1 1 auto; max-width: 28rem;">
                <input 
                  type="text" 
                  name="q" 
                  value={currentSearch} 
                  placeholder={
                    props.isUserBlog && props.userProfile 
                      ? `Search in ${props.userProfile.username}'s blog...` 
                      : currentCategory 
                        ? `Search in ${currentCategory}...` 
                        : "Search blogs..."
                  }
                  maxLength={limits.searchQuery} 
                  autocomplete="off" 
                />
                {currentSort === "popular" ? <input type="hidden" name="sort" value="popular" /> : null}
                <button type="submit"><ActionLabel action="search">Search</ActionLabel></button>
              </form>

              <div style="display: flex; gap: var(--space-2); flex: 0 0 auto;">
                <a href={sortUrl("latest")} class={currentSort === "latest" ? "button button--selected" : "button button--secondary"}>
                  Newest
                </a>
                <a href={sortUrl("popular")} class={currentSort === "popular" ? "button button--selected" : "button button--secondary"}>
                  Popular
                </a>
              </div>
            </div>

            <BlogCardList blogs={props.blogs} empty="No blog entries found." />

            <PaginationNav 
              nextHref={props.nextHref} 
              nextLabel="Older entries" 
              resetHref={props.resetHref} 
              resetLabel="Newest entries" 
            />

            <AdBannerMain />
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