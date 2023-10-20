import { notFound } from "next/navigation";
import { getSortedPostsData } from "../lib/posts";

export default async function Post({ params }: { params: { postId: string } }) {
  const posts = getSortedPostsData();
  const { postId } = params;
  if (!posts.find((post) => post.id === postId)) {
    return notFound();
  }
  return <div className="">page</div>;
}
