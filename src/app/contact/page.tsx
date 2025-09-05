import Container from "@/app/_components/container";
import Header from "../_components/header";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa6";

export default function ContactPage() {
  return (
    <main>
      <Container>
        <Header />
        <div className="pt-16 md:pt-32 pb-12 md:pb-20">
          <article className="flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-4xl font-bold mb-8">Get in Contact</h1>
            <p className="text-xl max-w-2xl text-neutral-600 dark:text-neutral-300 mb-8">
              If you'd like to get in touch, feel free to reach out via any of the
              methods below.
              <br />
              <br />
              You can find me on GitHub, LinkedIn, or send me an email directly.
              <br />
              <br />
              lachlanoco [at] gmail.com
            </p>
            <div className="flex flex-row items-center justify-center gap-10 text-5xl text-neutral-700 dark:text-white">
              <a
                href="https://github.com/Lachlanoc"
                aria-label="GitHub"
                className="transition-transform duration-200 hover:scale-110"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com/in/lachlan-oc"
                aria-label="LinkedIn"
                className="transition-transform duration-200 hover:scale-110"
              >
                <FaLinkedin />
              </a>
            </div>
          </article>
        </div>
      </Container>
    </main>
  );
}