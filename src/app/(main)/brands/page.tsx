import { BrandGrid } from "@/components/brands/BrandGrid";
import { Container } from "@/components/ui/container";

export default function BrandsPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[240px] w-full overflow-hidden">
        <div className="absolute inset-0 scale-[1.1]">
          <img
            src="/images/brands-hero.jpg"
            alt="Luxury cars"
            className="h-full w-full object-cover transform scale-[1.1] transition-transform duration-[2s]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20" />
        </div>
        <Container className="relative h-full">
          <div className="h-full flex flex-col items-center justify-center pt-[64px]">
            <div className="space-y-1.5 text-center">
              <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                Thương hiệu xe
              </h1>
              <p className="max-w-[600px] text-base text-white/90 md:text-lg px-4">
                Khám phá các thương hiệu xe hơi hàng đầu thế giới với những mẫu
                xe đẳng cấp và công nghệ tiên tiến
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <Container className="relative -mt-6">
        <div className="rounded-lg bg-background shadow-lg">
          <div className="px-4 py-6">
            <BrandGrid />
          </div>
        </div>
      </Container>
    </>
  );
}
