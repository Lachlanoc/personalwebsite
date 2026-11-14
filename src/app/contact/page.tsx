import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa6";
import Container from "@/app/_components/container";
import { EmailLink } from "@/app/_components/email-link";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description: "How to get in touch with Lachlan O'Connell: email, GitHub and LinkedIn.",
  path: "/contact",
});

const linkClass = "text-accent underline underline-offset-4 hover:no-underline";

/** "https://github.com/Lachlanoc" -> "github.com/Lachlanoc" */
const withoutScheme = (url: string) => url.replace(/^https?:\/\//, "");

export default function ContactPage() {
  return (
    <main>
      <Container>
        <div className="max-w-[40rem]">
          <h1 className="text-3xl font-semibold">Get in contact</h1>
          <p className="mt-5 text-lg leading-[1.65]">
            If you'd like to get in touch, feel free to reach out via any of
            the methods below.
          </p>

          <dl className="mt-8 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-4 text-lg">
            <dt className="flex items-center gap-3 text-muted">
              <FaEnvelope aria-hidden="true" />
              Email
            </dt>
            <dd>
              <EmailLink
                user={site.email.user}
                domain={site.email.domain}
                className={linkClass}
              />
            </dd>

            <dt className="flex items-center gap-3 text-muted">
              <FaGithub aria-hidden="true" />
              GitHub
            </dt>
            <dd>
              <a href={site.links.github} className={linkClass}>
                {withoutScheme(site.links.github)}
              </a>
            </dd>

            <dt className="flex items-center gap-3 text-muted">
              <FaLinkedin aria-hidden="true" />
              LinkedIn
            </dt>
            <dd>
              <a href={site.links.linkedin} className={linkClass}>
                {withoutScheme(site.links.linkedin)}
              </a>
            </dd>
          </dl>
        </div>
      </Container>
    </main>
  );
}
