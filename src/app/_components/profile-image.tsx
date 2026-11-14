import { SiteImage } from "./site-image";

type Props = {
  src: string;
  alt: string;
};

export function ProfileImage({ src, alt }: Props) {
  return (
    <SiteImage
      src={src}
      alt={alt}
      sizes="(min-width: 40rem) 24rem, 18rem"
      priority
      className="size-72 rounded-full border border-line bg-surface object-cover sm:size-96"
    />
  );
}
