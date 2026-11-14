import Link from "next/link";
import { SiteImage } from "./site-image";

type Props = {
  title: string;
  src: string;
  slug?: string;
  priority?: boolean;
};

const CoverImage = ({ title, src, slug, priority }: Props) => {
  const image = (
    <SiteImage
      src={src}
      alt={`Cover Image for ${title}`}
      // The content column is 60rem wide including its side padding.
      sizes="(min-width: 60rem) 57.5rem, 100vw"
      priority={priority}
      className="h-auto w-full rounded-md object-center"
    />
  );
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;
