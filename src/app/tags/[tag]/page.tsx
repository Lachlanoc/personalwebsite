import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/app/_components/container";
import { PostList } from "@/app/_components/post-list";
import { TagLinks } from "@/app/_components/tag-links";
import { getAllTags, getPostsByTagSlug, getTagBySlug } from "@/lib/api";
import { pageMetadata } from "@/lib/metadata";

// Only the tags in use at build time are valid pages.
export const dynamicParams = false;

type Params = {
  params: Promise<{ tag: string }>;
};

export default async function TagPage(props: Params) {
  const { tag: slug } = await props.params;
  const tag = getTagBySlug(slug);

  if (!tag) {
    return notFound();
  }

  const posts = getPostsByTagSlug(slug);

  return (
    <main>
      <Container>
        <Link href="/" className="text-sm text-muted hover:text-ink">
          All posts
        </Link>
        <h1 className="mt-4 text-3xl font-semibold">
          Posts about {tag.tag}
        </h1>
        <nav aria-label="Topics" className="mt-4 text-sm">
          <TagLinks
            tags={getAllTags().map((entry) => entry.tag)}
            currentSlug={slug}
          />
        </nav>
        <div className="mt-10">
          <PostList posts={posts} titleHeading="h2" />
        </div>
      </Container>
    </main>
  );
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { tag: slug } = await props.params;
  const tag = getTagBySlug(slug);

  if (!tag) {
    return notFound();
  }

  return pageMetadata({
    title: `Posts about ${tag.tag}`,
    description: `Posts by Lachlan O'Connell about ${tag.tag}.`,
    path: `/tags/${tag.slug}`,
  });
}

export async function generateStaticParams() {
  return getAllTags().map((entry) => ({ tag: entry.slug }));
}
