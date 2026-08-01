import type { GroupItem, PersonCard, GameItem, BlogListItem } from "../../models.js";
import type { SiteSettings } from "../../settings/site.js";
import { defaultBlogCategory, limits } from "../../policy.js";
import type { CurrentUser } from "../../currentUser.js";
import { CsrfInput, FormActions, FormError, FormField, FormStack } from "../../ui/forms.js";
import { CommunityBox } from "../../ui/groups.js";
import { Panel } from "../../ui/panels.js";
import { PeopleBox } from "../../ui/people.js";
import { Layout, SplitLayout, SplitPane } from "../../shell/index.js";
import { coolNewPeople } from "./featuredPeople.js";
import { AnnouncementBox, InfoCard, landingCards, AdBanner } from "./infoPanels.js";
import { blogPath, profilePath } from "../../paths.js";
import { MetaSubjectLink } from "../../ui/meta.js";
import { plainTextFromHtml } from "../../server/security/html.js";
import { truncateText } from "../../text.js";

type LandingPageProps = {
  user: CurrentUser | null;
  csrf: string;
  settings: SiteSettings;
  newest: PersonCard[];
  newestGroups: GroupItem[];
  spotlightGames: GameItem[];
  popularBlogs: BlogListItem[];
  message?: string;
  passwordResetAvailable?: boolean;
};

export function LandingPage(props: LandingPageProps) {
  const welcomeText = props.settings.home.welcomeText.trim();

  return (
    <Layout title={props.settings.identity.tagline} user={props.user} seo={{ canonicalPath: "/" }}>
      <SplitLayout variant="landing">
        
        <SplitPane area="main">
          <PeopleBox 
            title="Cool new people" 
            people={coolNewPeople(props.newest)} 
            more="/browse" 
            singleLine 
          />
          
          <CommunityBox 
            title="Cool new communities" 
            groups={props.user ? props.newestGroups : coolNewCommunities(props.newestGroups)} 
            more="/groups" 
            singleLine 
          />
          
          <AnnouncementBox settings={props.settings} />

          <Panel title="Flash arcade spotlights" tone="soft">
            {props.spotlightGames && props.spotlightGames.length ? (
              <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4); width: 100%;">
                {props.spotlightGames.map((game) => {
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
              <p><i>No games loaded.</i></p>
            )}
            <div style="text-align: center; margin-top: var(--space-5);">
              <a href="/arcade" class="button">&raquo; Browse Full Arcade Collection</a>
            </div>
          </Panel>
        </SplitPane>

        <SplitPane area="sidebar">
          {welcomeText ? (
            <div class="welcome">
              <p>{welcomeText}</p>
            </div>
          ) : null}
          
          <Panel className="auth-panel" title="Member login / sign up">
            <FormError>{props.message}</FormError>
            <FormStack action="/login">
              <CsrfInput csrf={props.csrf} />
              <FormField label="Email:">
                <input type="email" name="email" autocomplete="email" required maxLength={limits.emailMax} />
              </FormField>
              <FormField label="Password:">
                <input name="password" type="password" autocomplete="current-password" required maxLength={limits.passwordMax} />
              </FormField>
              <FormActions>
                <button type="submit">Log in</button>
                <a class="button button--secondary" href="/signup">Sign up</a>
              </FormActions>
            </FormStack>
            {props.passwordResetAvailable ? <a class="forgot" href="/reset">Forgot your password?</a> : null}
          </Panel>

          <Panel title="Popular blogs" tone="soft">
            {props.popularBlogs && props.popularBlogs.length ? (
              <div style="display: grid; gap: var(--space-3); text-align: left;">
                {props.popularBlogs.map((entry) => (
                  <article key={entry.id} class="content-card" style="padding: var(--space-4); display: grid; gap: var(--space-2);">
                    <h3>
                      <a href={blogPath(entry)}>{entry.title}</a>
                    </h3>
                    {entry.username && entry.authorHandle ? (
                      <p class="card-attribution">
                        By <MetaSubjectLink href={profilePath(entry.authorHandle)}>{entry.username}</MetaSubjectLink>
                        <small class="blog-card__category">{entry.category ?? defaultBlogCategory}</small>
                      </p>
                    ) : null}
                    <p>
                      {truncateText(plainTextFromHtml(entry.bodyHtml), 150)}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p><i>There are no blog entries yet.</i></p>
            )}
            <div style="text-align: center; margin-top: var(--space-4);">
              <a href="/blog?sort=popular" class="button">&raquo; Browse Popular Blogs</a>
            </div>
          </Panel>

          <AdBanner />
        </SplitPane>

      </SplitLayout>
      
      <div class="info-grid">
        {landingCards.map((info) => <InfoCard {...info} />)}
      </div>
    </Layout>
  );
}

function coolNewCommunities(groups: GroupItem[]) {
  return groups.slice(0, limits.newestCommunities).map((group) => ({ ...group, href: null }));
}