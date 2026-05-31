import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

function Anchor({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) {
    return (
      <Link href={href} {...(rest as Record<string, unknown>)}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <ArrowUpRight size={13} className="ml-0.5 inline align-text-top" />
    </a>
  );
}

export const mdxComponents = {
  a: Anchor,
  h2: (props: ComponentPropsWithoutRef<"h2">) => <h2 {...props} />,
  h3: (props: ComponentPropsWithoutRef<"h3">) => <h3 {...props} />,
  ul: (props: ComponentPropsWithoutRef<"ul">) => <ul {...props} />,
  ol: (props: ComponentPropsWithoutRef<"ol">) => <ol {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => <blockquote {...props} />,
  pre: (props: ComponentPropsWithoutRef<"pre">) => <pre {...props} />,
  code: (props: ComponentPropsWithoutRef<"code">) => <code {...props} />,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  img: (props: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} className="my-6 w-full rounded-xl border border-white/10" alt={props.alt ?? ""} />
  ),
};
