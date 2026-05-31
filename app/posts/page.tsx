import type { Metadata } from "next";
import { PostList } from "@/components/posts/PostList";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Posts",
  description: "Transmissions — writing by Carlos Junior across dev.to, Medium, and here.",
};

export default async function PostsPage() {
  const posts = await getAllPosts();
  return (
    <div className="pt-28 pb-12">
      <PostList posts={posts} />
    </div>
  );
}
