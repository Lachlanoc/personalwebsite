import Link from "next/link";
import Container from "@/app/_components/container";
import { NavLink } from "@/app/_components/nav-link";
import { SearchDialog } from "@/app/_components/search-dialog";
import { ThemeToggle } from "@/app/_components/theme-toggle";

const Header = () => {
  return (
    <header className="z-10 border-b border-line bg-paper md:sticky md:top-0">
      <Container>
        {/* On narrow phones the nav drops to its own row under the name. */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-1 py-3">
          <Link href="/" className="text-2xl font-semibold">
            Lachlan O'Connell
          </Link>
          <nav
            aria-label="Main"
            className="order-3 flex basis-full gap-6 font-medium sm:order-none sm:ml-auto sm:basis-auto"
          >
            <NavLink href="/" alsoActiveFor={["/posts", "/tags"]}>
              Posts
            </NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>
          <div className="ml-auto flex items-center sm:ml-0">
            <SearchDialog />
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
