import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/mdx-components";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 pt-40 pb-32 lg:px-10">
      <Link
        href="/blog"
        className="mb-10 inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-5" />
        Back to Blog
      </Link>

      <header className="mb-14">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          {post.title}
        </h1>
        <div className="mt-5 flex items-center gap-5 text-base text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-5" />
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-5" />
            {post.readingTime}
          </span>
        </div>
      </header>

      <article className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
        {content}
      </article>
    </div>
  );
}
