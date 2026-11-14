import Container from "@/app/_components/container";
import { FeaturedPost } from "@/app/_components/featured-post";
import { PostList } from "@/app/_components/post-list";
import { TagLinks } from "@/app/_components/tag-links";
import { getAllPosts, getAllTags } from "@/lib/api";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  description: site.description,
  path: "/",
});

export default function Index() {
  const [latest, ...earlier] = getAllPosts();
  const tags = getAllTags().map((entry) => entry.tag);

  return (
    <main>
      <Container>
        <h1 className="sr-only">{site.name}</h1>
        <p className="max-w-[40rem] text-xl">{site.intro}</p>

        {latest && (
          <div className="mt-12">
            <FeaturedPost post={latest} />
          </div>
        )}

        {earlier.length > 0 && (
          <section className="mt-20" aria-labelledby="earlier-posts">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <h2 id="earlier-posts" className="text-xl font-semibold">
                Earlier posts
              </h2>
              <nav aria-label="Topics" className="text-sm">
                <TagLinks tags={tags} />
              </nav>
            </div>
            <PostList posts={earlier} yearHeading="h3" />
          </section>
        )}
      </Container>
    </main>
  );
}
