import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

export function HomeCarousel() {
    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
    )

    // Image paths (Skipping 4.png as requested)
    // Images: 1, 2, 3, 5, 6, 7
    const images = [1, 2, 3, 5, 6, 7].map((num) => `/carousel/${num}.png`);

    return (
        <div className="w-full max-w-6xl mx-auto px-4 mb-16">
            <Carousel
                plugins={[plugin.current]}
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {images.map((src, index) => (
                        <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/3">
                            <div className="p-1">
                                <Card className="overflow-hidden border-0 shadow-xl bg-transparent transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                    <CardContent className="flex items-center justify-center p-0 h-48 md:h-56 relative rounded-2xl overflow-hidden group">
                                        {/* Glass overlay - purely decorative now */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 z-10 transition-opacity group-hover:opacity-40" />

                                        <img
                                            src={src}
                                            alt={`Gallery Image ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://placehold.co/600x400/2a2a2a/FFF?text=Image+${index + 1}`;
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}
