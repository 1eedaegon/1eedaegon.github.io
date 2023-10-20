import Posts from "@/components/Posts";

export default function Home() {
  return (
    <main className="px-6 mx-auto">
      <p className="mt-12 mb-12 text-3xl text-center dark:text-white">
        Hello and Welcome! 🙌&nbsp;
      </p>
      <p className="mt-12 mb-12 text-3xl text-center dark:text-white">
        <span className="whitespace-nowrap">
          I&apos;m{" "}
          <span className="font-bold">1eedaegon, Software engineer </span>
        </span>
      </p>
      <Posts />
    </main>
  );
}
