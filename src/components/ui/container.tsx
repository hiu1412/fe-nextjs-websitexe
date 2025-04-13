import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * If true, the container will have padding
   * @default true
   */
  padded?: boolean;
}

export function Container({
  className,
  padded = true,
  ...props
}: ContainerProps) {
  return (
    <div className="w-full">
      <div
        className={cn(
          "mx-auto w-full max-w-screen-xl",
          padded && "px-4 md:px-6 lg:px-8",
          className
        )}
        {...props}
      />
    </div>
  );
}
