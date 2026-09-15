import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, Clock } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Blog",
  description: "Project deep-dives, game dev insights, and technical write-ups.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-6 pt-40 pb-32 lg:px-10">
      <div className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Project deep-dives, game dev insights, and technical write-ups.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-lg text-muted-foreground">No posts yet. Check back soon!</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="rounded-2xl transition-colors hover:bg-muted/50">
                <CardHeader className="px-8 pt-8 pb-2">
                  <CardTitle className="text-2xl md:text-3xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-4" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-4" />
                      {post.readingTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
