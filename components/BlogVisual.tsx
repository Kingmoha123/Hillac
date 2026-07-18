import Image from "next/image";
import type { BlogImage } from "@/data/blog";

type BlogVisualProps = {
  image: BlogImage;
  title: string;
  category: string;
  priority?: boolean;
};

export function BlogVisual({ image, title, category, priority = false }: BlogVisualProps) {
  if (image.src) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        width={960}
        height={540}
        className="blog-image"
        priority={priority}
      />
    );
  }

  return (
    <div className="blog-placeholder" role="img" aria-label={image.alt}>
      <span>{category}</span>
      <strong>{image.label || title}</strong>
    </div>
  );
}
