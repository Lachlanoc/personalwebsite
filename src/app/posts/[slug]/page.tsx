import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentPosts, getAllPosts, getPostBySlug } from "@/lib/api";
import { socialImage } from "@/lib/images";
import { renderMarkdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { CodeCopy } from "@/app/_components/code-copy";
import Container from "@/app/_components/container";
import DateFormatter from "@/app/_components/date-formatter";
import { PostNav } from "@/app/_components/post-nav";
import { SiteImage } from "@/app/_components/site-image";
import { TagLinks } from "@/app/_components/tag-links";
import { Toc } from "@/app/_components/toc";
import { TocHighlight } from "@/app/_components/toc-highlight";

// Only the posts that exist at build time are valid pages.
export const dynamicParams = false;

/** A table of contents is only worth showing once a post has this many sections. */
const MIN_SECTIONS_FOR_TOC = 3;

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const { html, toc } = await renderMarkdown(post.content || "");
  const { older, newer } = getAdjacentPosts(post.slug);
  const showToc =
    toc.filter((entry) => entry.depth === 2).length >= MIN_SECTIONS_FOR_TOC;

  // Describes the post to search engines in a form they can read directly.
  const image = socialImage(post.slug);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `${site.url}/posts/${post.slug}`,
    image: image ? `${site.url}${image.path}` : undefined,
    keywords: post.tags.join(", "),
    author: { "@type": "Person", name: site.name, url: `${site.url}/about` },
  };

  return (
    <main>
      <Container>
        <article>
          {/* One reading column; the contents rail joins it on wide screens. */}
          <div className="lg:grid lg:grid-cols-[minmax(0,40rem)_13rem] lg:gap-[4.5rem]">
            <div className="min-w-0">
              <header>
                <Link href="/" className="text-sm text-muted hover:text-ink">
                  All posts
                </Link>
                <h1 className="mt-4 text-2xl font-semibold sm:text-3xl md:text-4xl">
                  {post.title}
                </h1>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                  <DateFormatter dateString={post.date} />
                  <span>{post.readingTime} min read</span>
                  <TagLinks tags={post.tags} />
                </div>
              </header>

              <SiteImage
                src={post.coverImage}
                alt=""
                sizes="(min-width: 42.5rem) 40rem, 100vw"
                priority
                className="mt-8 h-auto w-full rounded-md border border-line bg-surface"
              />

              {showToc && (
                <details className="mt-8 rounded-md border border-line px-4 py-3 lg:hidden">
                  <summary className="cursor-pointer text-sm font-medium">
                    On this page
                  </summary>
                  <nav aria-label="On this page" className="mt-3">
                    <Toc entries={toc} />
                  </nav>
                </details>
              )}

              <div
                className="prose prose-lg mt-10 max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>

            {showToc && (
              <aside className="hidden lg:block">
                <nav
                  aria-label="On this page"
                  className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto"
                >
                  <p className="mb-3 text-sm font-medium">On this page</p>
                  <Toc entries={toc} />
                </nav>
              </aside>
            )}
          </div>

          <PostNav older={older} newer={newer} />
        </article>
      </Container>
      <script
        type="application/ld+json"
        // "<" is escaped so post text can never close the script element.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <CodeCopy />
      {showToc && <TocHighlight ids={toc.map((entry) => entry.id)} />}
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/posts/${post.slug}`,
    imageKey: post.slug,
    publishedDate: post.date,
    tags: post.tags,
  });
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
