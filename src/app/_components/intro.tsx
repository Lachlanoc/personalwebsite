"use client"
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
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8">
        <Link href="/" onClick={handleHomeClick}>
           Lachlan O'Connell
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
          href="/contact"
          className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight hover:underline">
          Contact
        </Link>
      </div>
    </section>
  );
}
