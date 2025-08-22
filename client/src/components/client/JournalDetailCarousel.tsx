import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Badge } from "@/components/ui/badge";

type Photo = {
  url: string;
  public_id: string;
};

type JournalDetailCarouselProps = {
  photos: Photo[];
  title: string;
};

export default function JournalDetailCarousel({ photos, title }: JournalDetailCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(); 
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="w-1/2 border-r relative">
      {/* Badge showing current index */}
      <div className="absolute top-4 right-4 z-10">
        <Badge variant="secondary">
          {currentIndex + 1}/{photos.length}
        </Badge>
      </div>

      <div className="overflow-hidden w-full h-[600px]" ref={emblaRef}>
        <div className="flex h-full">
          {photos.map((photo) => (
            <div className="flex-[0_0_100%] h-full" key={photo.public_id}>
              <img
                src={photo.url}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
