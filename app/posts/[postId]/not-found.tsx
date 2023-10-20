import { notFound } from "next/navigation";
import { getSortedPostsData } from "@/lib/posts";

export default function NotFound() {
  return <h1>The requested post doesn&apos;t exist</h1>;
}
