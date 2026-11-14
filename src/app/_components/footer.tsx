import Container from "@/app/_components/container";
import { FaGithub, FaLinkedin, FaRss } from "react-icons/fa6";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container>
        <div className="flex items-center justify-between py-8 text-sm text-muted">
          <p>© Lachlan O'Connell</p>
          <div className="flex items-center gap-5 text-2xl">
            <a href="/feed.xml" aria-label="RSS feed" className="hover:text-ink">
              <FaRss aria-hidden="true" />
            </a>
            <a
              href={site.links.github}
              aria-label="GitHub"
              className="hover:text-ink"
            >
              <FaGithub aria-hidden="true" />
            </a>
            <a
              href={site.links.linkedin}
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
