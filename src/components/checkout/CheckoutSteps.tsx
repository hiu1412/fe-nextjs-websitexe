import { cn } from "@/lib/utils";

interface Step {
  id: number;
  name: string;
  description: string;
}

const steps: Step[] = [
  {
    id: 1,
    name: "Thông tin thanh toán",
    description: "Điền thông tin người thanh toán",
  },
  {
    id: 2,
    name: "Thông tin giao hàng",
    description: "Điền thông tin người nhận hàng",
  },
  {
    id: 3,
    name: "Phương thức thanh toán",
    description: "Chọn phương thức thanh toán",
  },
];

interface CheckoutStepsProps {
  currentStep: number;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            <div
              className={cn(
                "group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                step.id < currentStep
                  ? "border-primary"
                  : step.id === currentStep
                  ? "border-primary"
                  : "border-gray-200"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  step.id < currentStep
                    ? "text-primary"
                    : step.id === currentStep
                    ? "text-primary"
                    : "text-gray-500"
                )}
              >
                Bước {step.id}
              </span>
              <span className="text-sm font-medium">{step.name}</span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
