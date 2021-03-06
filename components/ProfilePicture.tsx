import Image from "next/image";
export default function ProfilePicture() {
  return (
    <section className="mx-auto">
      <Image
        className="
        border-4 
        dark:border-slate-500 
        drop-shadow-xl
        shadow-black 
        rounded-full
        mx-auto
        mt-8"
        src="/image/profile.png"
        width={200}
        height={200}
        alt="1eedaegon"
        priority={true}
      />
    </section>
  );
}
