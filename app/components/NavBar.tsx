import Link from "next/link";
import { FaGit, FaGithub, FaGithubSquare } from "react-icons/fa";

export default function NavBar() {
  return (
    <nav className="bg-slate-600 p-4 sticky top-0 drop-shadow-xl z10">
      <div className="prose prose-xl mx-auto flex flex-col justify-between sm:flex-row">
        <h1 className="text-3xl font-bold text-white grid place-content-center mb-2 md:mb-0">
          <Link
            href="/"
            className="text-white/90 no-underline hover:text-white"
          >
            Gon
          </Link>
        </h1>
        <div className="flex flex-row justify-center sm:justify-evenly align-middle gap-4 text-white text-xl lg:text-3xl">
          <Link
            className="text-middle/90 hover:text-white"
            href="https://github.com/1eedaegon"
          >
            <FaGithub />
          </Link>
          <Link
            className="text-middle/90 hover:text-white"
            href="https://gist.github.com/1eedaegon"
          >
            <FaGithubSquare />
          </Link>
        </div>
      </div>
    </nav>
  );
}
