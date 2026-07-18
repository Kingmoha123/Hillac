import Image from "next/image";
import type { ProjectImage } from "@/data/site";

type ProjectVisualProps = {
  image: ProjectImage;
  title: string;
  category: string;
  priority?: boolean;
};

export function ProjectVisual({ image, title, category, priority = false }: ProjectVisualProps) {
  if (image.src) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        width={960}
        height={620}
        className="project-image"
        priority={priority}
      />
    );
  }

  return (
    <div className="project-placeholder" role="img" aria-label={image.alt}>
      <span>{category}</span>
      <strong>{image.label || title}</strong>
    </div>
  );
}
