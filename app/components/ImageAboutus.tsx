// components/ImageGrid.tsx
import Image from "next/image";

interface ImageAboutusProps {
  images: { src: string; alt: string }[];
}

export default function ImageAboutus({ images }: ImageAboutusProps) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto md:mx-0">
      {images.slice(0, 2).map((img, i) => (
        <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
          <Image src={img.src} alt={img.alt} fill className="object-cover" />
        </div>
      ))}
      <div className="col-span-2">
        <div className="relative aspect-[2/1] rounded-xl overflow-hidden">
          <Image src={images[2].src} alt={images[2].alt} fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}
