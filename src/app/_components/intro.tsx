"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Intro() {
  const router = useRouter();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      router.replace("/");
      window.location.reload();
    }
  };

  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between ">
      <h1 className="flex flex-col sm:flex-row text-5xl md:text-7xl text-center sm:text-left font-bold tracking-tighter leading-tight 
      mt-6 mb-2 md:mb-12 md:pr-8">
        <Link href="/" onClick={handleHomeClick} className="md:mr-2">
          Lachlan&nbsp;
        </Link>
        <Link href="/" onClick={handleHomeClick}>
          O'Connell
        </Link>
      </h1>
      <div className="text-center md:text-left text-lg mt-5 md:pl-8">
        <Link 
          href="/"
          onClick={handleHomeClick}
          className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight hover:underline mr-10">
          Home
        </Link>
        <Link 
          href="/about"
          className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight hover:underline mr-10">
          About
        </Link>
        <Link 
          href="/contact"
          className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight hover:underline">
          Contact
        </Link>
      </div>
    </section>
  );
}
