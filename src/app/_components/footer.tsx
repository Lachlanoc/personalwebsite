import Container from "@/app/_components/container";
import Link from "next/link";
import { FaLinkedin, FaGithub } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 dark:bg-slate-800">
      <Container>
        <div className="py-8 flex flex-col lg:flex-row items-center">
          <h3 className="text-xl lg:text-[1rem] font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
            <Link href="/" className="hover:underline">
              Lachlan O'Connell ©
            </Link>
          </h3>
          <div className="flex flex-col lg:flex-row justify-end items-center lg:pl-4 lg:w-1/2">
            <a
              href="https://github.com/Lachlanoc"
              className="dark:text-white lg:px-4 sm:text-3xl text-5xl transition-transform duration-200 hover:scale-120 mb-6 lg:mb-0"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/in/lachlan-oc"
              className="dark:text-white pl-6 pr-4 lg:px-4 sm:text-3xl text-5xl transition-transform duration-200 hover:scale-120 mb-6 lg:mb-0"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
