import Container from "@/app/_components/container";
import Header from "../_components/header";

const pfp = "/assets/pfp.webp";

export default function AboutPage() {
  return (
    <main>
      <Container>
        <Header />
        <article className="flex flex-col items-center justify-center text-center">
          <div className="py-10 sm:py-20">
          <img
            src={pfp}
            alt="Photo of Lachlan O'Connell"
            className="rounded-full w-96 object-cover shadow-xl
            border-4 border-neutral-300 dark:border-slate-600 transition-all duration-300"
          />
          </div>
          <h1 className="text-4xl font-bold mb-4">About Me</h1>
          <p className="text-xl max-w-2xl text-neutral-600 dark:text-neutral-300 mb-8">
            My name is Lachlan O'Connell, I'm a student at the University of Queensland currently studying a
            Bachelor of Computer Science with a dual major in Cyber Security and Programming Languages. 
            <br />
            <br />
            I'm passionate about cyber security, particularly on a national scale. I enjoy keeping up with the latest
            news and trends in the field and am always eager to learn more.
            <br />
            <br />
            In my free time I also enjoy studying Japanese and love exploring ways to apply what I've learnt in computer science
            to more efficiently learn the language.
          </p>
        </article>
      </Container>
    </main>
  );
}