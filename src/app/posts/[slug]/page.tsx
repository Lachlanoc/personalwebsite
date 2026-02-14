import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Container from "@/app/_components/container";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");
  return (
    <main>
      <Container>
        <article className="prose text-black prose-headings:break-words prose-headings:hyphens-auto prose-lg
            prose-headings:mt-8 prose-headings:font-semibold
            prose-h1:text-3xl sm:prose-h1:text-5xl prose-h1:font-extrabold sm:prose-h1:font-bold prose-h2:text-3xl
            prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-2xl prose-h6:text-xl overflow-x-auto
            dark:text-slate-400 dark:prose-headings:text-slate-400 dark:prose-a:text-slate-400 dark:prose-blockquote:text-slate-400 dark:prose-strong:text-slate-300
            overflow-hidden max-w-none mb-16">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
          />
          <PostBody content={content} />
        </article>
      </Container>
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

  const title = `${post.title}`;

  return {
    title,
    openGraph: {
      title,
      images: [post.ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
