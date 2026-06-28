import { MobileLazyImage } from "@/components/media/MobileLazyImage";
import type { ServerGalleryItem } from "@/lib/data/types";

export function ServerGalleryCard({ item }: { item: ServerGalleryItem }) {
  return (
    <article className="surface-card hover-flip-card group overflow-hidden rounded-[28px]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <MobileLazyImage
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090e1d]/86 via-[#090e1d]/14 to-transparent" />
      </div>
      <div className="p-5">
        <p className="text-xs text-dream-blue/82">{item.categoryName}</p>
        <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
        <p className="mt-3 text-sm leading-7 text-sky-900/66">{item.description}</p>
      </div>
    </article>
  );
}
