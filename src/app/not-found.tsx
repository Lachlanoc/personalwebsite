import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/app/_components/container";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main>
      <Container>
        <div className="max-w-[40rem] py-10">
          <h1 className="text-3xl font-semibold">Page not found</h1>
          <p className="mt-5 text-lg leading-[1.65]">
            There is nothing at this address. The page may have moved, or the
            link may be mistyped.
          </p>
          <p className="mt-5 text-lg">
            <Link
              href="/"
              className="text-accent underline underline-offset-4 hover:no-underline"
            >
              See all posts
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
}
