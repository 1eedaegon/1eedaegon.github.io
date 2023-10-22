import Posts from "@/components/Posts";
import ProfilePicture from "@/components/ProfilePicture";

export default function Home() {
  return (
    <main className=" px-6">
      <section className="flex flex-nowrap mx-auto max-w-2xl">
        <ProfilePicture />
        <article className="ml-12">
          <p className="mt-12 mb-12 text-3xl text-left dark:text-white">
            🙌&nbsp;Welcome!
          </p>
          <p className="flex flex-nowrap mt-12 mb-12 text-3xl text-left dark:text-white">
            {/* <span className="whitespace-nowrap"> */}
            <span>
              I&apos;m
              <span className="font-bold">1eedaegon, </span>
            </span>
            <span className="font-bold">Software engineer</span>
            {/* </span> */}
          </p>
        </article>
      </section>
      <Posts />
    </main>
  );
}
