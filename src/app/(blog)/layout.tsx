import { BlogNav } from "@/components/layout/blog-nav";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BlogNav />
      {children}
    </>
  );
}
