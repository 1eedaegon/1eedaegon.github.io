import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-slate-600 p-4 sticky top-0 drop-shadow-xl z10">
      <div className="prose prose-xl mx-auto flex flex-col justify-between sm:flex-row">
        <h1 className="text-3xl font-bold text-white grid place-content-center mb-2 md:mb-0">
          <Link
            href="/"
            className="text-white/90 no-underline hover:text-white"
          >
            1eedaegon.io
          </Link>
        </h1>
      </div>
    </nav>
  );
}
