import Posts from "@/components/Posts";
import ProfilePicture from "@/components/ProfilePicture";

export default function Home() {
  return (
    <main className=" px-6">
      <section className=" mx-auto max-w-2xl">
        <ProfilePicture />
        <article>
          <p className="mt-12 mb-12 text-3xl text-left dark:text-white">
            🙌&nbsp;Welcome!
          </p>
          <p className="mt-12 mb-12 text-3xl text-left dark:text-white">
            <span className="whitespace-nowrap">
              I&apos;m <span className="font-bold">1eedaegon, </span>
              <span className="font-bold">Software engineer </span>
            </span>
          </p>
        </article>
      </section>
      <Posts />
    </main>
  );
}
