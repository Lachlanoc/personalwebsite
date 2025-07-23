import Link from "next/link";

const Header = () => {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-6 mt-6">
        <Link href="/" className="hover:underline">
           Lachlan O'Connell
        </Link>
      </h1>
      <div className="text-center md:text-left text-lg">
        <Link 
          href="/"
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
};

export default Header;
