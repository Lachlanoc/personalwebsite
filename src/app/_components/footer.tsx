import Container from "@/app/_components/container";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container>
        <div className="flex items-center justify-between py-6 text-sm text-muted">
          <p>© Lachlan O'Connell</p>
          <div className="flex items-center gap-5 text-xl">
            <a
              href="https://github.com/Lachlanoc"
              aria-label="GitHub"
              className="hover:text-ink"
            >
              <FaGithub aria-hidden="true" />
            </a>
            <a
              href="https://linkedin.com/in/lachlan-oc"
              aria-label="LinkedIn"
              className="hover:text-ink"
            >
              <FaLinkedin aria-hidden="true" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
