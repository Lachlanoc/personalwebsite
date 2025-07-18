import Container from "@/app/_components/container";
import Header from "../_components/header";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa6";

const pfp = "/assets/pfp.webp";

export default function ContactPage() {
  return (
    <main>
      <Container>
        <Header />
        <article className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <img
            src={pfp}
            alt="Photo of Lachlan O'Connell"
            className="rounded-full w-96 sm:w-64 md:w-72 lg:w-80 xl:w-96 object-cover shadow-xl mb-6 border-4 border-neutral-300 dark:border-slate-600 transition-all duration-300"
          />
          <h1 className="text-4xl font-bold mb-4">Get in touch</h1>
          <p className="text-xl max-w-2xl text-neutral-600 dark:text-neutral-300 mb-8">
            I'm always open to discussing new projects, ideas, or opportunities. Feel free to reach out — I'd love to hear from you.
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
            <a
              href="mailto:lachlanoco@gmail.com"
              aria-label="Email"
              className="transition-transform duration-200 hover:scale-110"
            >
              <FaEnvelope />
            </a>
          </div>
        </article>
      </Container>
    </main>
  );
}