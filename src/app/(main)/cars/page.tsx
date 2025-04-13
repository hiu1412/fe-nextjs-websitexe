import { AllCars } from "@/components/cars/AllCars";

export default function CarsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Danh sách xe</h1>
      <AllCars />
    </div>
  );
}
