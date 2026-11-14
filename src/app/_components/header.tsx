import Link from "next/link";
import Container from "@/app/_components/container";
import { NavLink } from "@/app/_components/nav-link";
import { SearchDialog } from "@/app/_components/search-dialog";
import { ThemeToggle } from "@/app/_components/theme-toggle";

const Header = () => {
  return (
    <header className="z-10 border-b border-line bg-paper md:sticky md:top-0">
      <Container>
        {/* Phones: the name and buttons share the first row and the nav sits
            below. The grid keeps the buttons on that row however narrow the
            screen. From tablet width up everything is on one row. */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 py-3 sm:flex sm:gap-x-8">
          <Link href="/" className="text-2xl font-semibold">
            Lachlan O'Connell
          </Link>
          <nav
            aria-label="Main"
            className="order-3 col-span-2 flex gap-6 font-medium sm:order-none sm:ml-auto"
          >
            <NavLink href="/" alsoActiveFor={["/posts", "/tags"]}>
              Posts
            </NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>
          <div className="flex items-center">
            <SearchDialog />
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
