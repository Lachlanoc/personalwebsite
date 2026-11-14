import Container from "@/app/_components/container";
import { SiteImage } from "@/app/_components/site-image";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Lachlan O'Connell is a computer science student at the University of Queensland with an interest in cyber security and learning Japanese.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main>
      <Container>
        <div className="grid gap-8 md:grid-cols-[13rem_minmax(0,40rem)] md:gap-12">
          <SiteImage
            src="/assets/pfp.webp"
            alt="Photo of Lachlan O'Connell"
            sizes="(min-width: 48rem) 13rem, 10rem"
            priority
            className="size-40 rounded-full border border-line bg-surface object-cover md:size-52"
          />
          <div>
            <h1 className="text-3xl font-semibold">About me</h1>
            <div className="mt-5 space-y-5 text-lg leading-[1.65]">
              <p>
                My name is Lachlan O'Connell, I'm a student at the University of
                Queensland currently studying a Bachelor of Computer Science
                with a dual major in Cyber Security and Programming Languages.
              </p>
              <p>
                I'm passionate about cyber security, particularly on a national
                scale. I enjoy keeping up with the latest news and trends in
                the field and am always eager to learn more.
              </p>
              <p>
                In my free time I also enjoy studying Japanese and love
                exploring ways to apply what I've learnt in computer science to
                more efficiently learn the language.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
