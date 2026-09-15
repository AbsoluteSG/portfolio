import Link from "next/link";
import type { ComponentProps } from "react";

/** Components passed to compileMDX so Markdown links behave: external links open in a new tab. */
function MdxLink({ href = "", children, ...rest }: ComponentProps<"a">) {
  const external = /^https?:\/\//.test(href) || /\.[a-z0-9]{2,4}$/i.test(href);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

export const mdxComponents = { a: MdxLink };
