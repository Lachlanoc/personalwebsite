import { imageAttrs } from "@/lib/images";

type Props = {
  /** Original path under public/, e.g. "/assets/blog/dain/cover.webp". */
  src: string;
  alt: string;
  /** How wide the image is displayed, in the form the sizes attribute takes. */
  sizes: string;
  /** Set on the one image a visitor sees first, so it loads ahead of the rest. */
  priority?: boolean;
  className?: string;
};

/**
 * An <img> that serves the resized copies made by scripts/optimize-images.mjs.
 * next/image is not used because a static export has no image optimiser.
 */
export function SiteImage({ src, alt, sizes, priority = false, className }: Props) {
  const attrs = imageAttrs(src);
  return (
    <img
      src={attrs.src}
      srcSet={attrs.srcSet}
      sizes={attrs.srcSet ? sizes : undefined}
      width={attrs.width}
      height={attrs.height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      // React also preloads images marked high priority from <head>.
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}
