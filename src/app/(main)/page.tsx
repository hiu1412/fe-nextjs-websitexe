import { Carousel } from "@/components/carousel";
import { NewestCars } from "@/components/cars/NewestCars";

const carouselSlides = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070",
    title: "Khám phá các dòng xe mới nhất",
    description: "Trải nghiệm công nghệ và thiết kế hiện đại",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070",
    title: "Ưu đãi đặc biệt",
    description: "Giảm giá lên đến 20% cho các dòng xe cao cấp",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070",
    title: "Dịch vụ hậu mãi tận tâm",
    description: "Chăm sóc xe của bạn với đội ngũ chuyên nghiệp",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section with Carousel */}
      <section className="container mx-auto px-4 pt-6">
        <div className="rounded-xl overflow-hidden">
          <Carousel slides={carouselSlides} />
        </div>
      </section>

      {/* Newest Cars 2025 Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Xe Mới Nhất 2025
        </h2>
        <NewestCars />
      </section>
    </div>
  );
}
