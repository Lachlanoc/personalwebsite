import Link from "next/link";

const Header = () => {
  return (
    <section className="flex-col md:flex-row flex mb-2 md:mb-0 items-center md:justify-between">
      <h1 className="flex flex-col sm:flex-row text-center sm:text-left text-3xl md:text-4xl
                    font-bold tracking-tight md:tracking-tighter leading-tight mb-2 mt-6">
        <Link href="/" className="md:mr-2">
          Lachlan&nbsp;
        </Link>
        <Link href="/">
          O'Connell
        </Link>
      </h1>
      <div className="text-center mt-5 md:text-left text-lg">
        <Link 
          href="/"
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
};

export default Header;
