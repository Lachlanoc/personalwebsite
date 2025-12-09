"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      router.replace("/");
      window.location.reload();
    }
  };

  return (
    <section className="flex flex-col xl:flex-row mb-2 xl:mb-0 items-center xl:justify-between">
      <h1 className="flex flex-col sm:flex-row text-3xl xl:text-7xl text-center sm:text-left font-bold tracking-tight leading-tight mt-6 mb-2 xl:mb-12 xl:pr-8">
        <Link href="/" onClick={handleHomeClick} className="xl:mr-2">
          Lachlan&nbsp;
        </Link>
        <Link href="/" onClick={handleHomeClick}>
          O'Connell
        </Link>
      </h1>
      <div className="text-center xl:text-left text-lg mt-5 xl:pl-8">
        <Link 
          href="/"
          onClick={handleHomeClick}
          className="text-2xl xl:text-4xl font-bold tracking-tight xl:tracking-tighter leading-tight hover:underline mr-8 xl:mr-10">
          Home
        </Link>
        <Link 
          href="/about"
          className="text-2xl xl:text-4xl font-bold tracking-tight xl:tracking-tighter leading-tight hover:underline mr-8 xl:mr-10">
          About
        </Link>
        <Link 
          href="/contact"
          className="text-2xl xl:text-4xl font-bold tracking-tight xl:tracking-tighter leading-tight hover:underline">
          Contact
        </Link>
      </div>
    </section>
  );
};

export default Header;
