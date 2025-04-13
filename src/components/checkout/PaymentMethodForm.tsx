import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCheckoutStore } from "@/store/checkout-store";
import type { PaymentMethod } from "@/store/checkout-store";

const paymentFormSchema = z.object({
  paymentMethod: z.enum(["cod", "bank_transfer"] as const),
});

export function PaymentMethodForm() {
  const { paymentMethod, setPaymentMethod } = useCheckoutStore();

  const form = useForm<{ paymentMethod: PaymentMethod }>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod,
    },
  });

  function onSubmit(data: { paymentMethod: PaymentMethod }) {
    setPaymentMethod(data.paymentMethod);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Phương thức thanh toán</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="cod" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Thanh toán khi nhận hàng (COD)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="bank_transfer" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Chuyển khoản ngân hàng
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Xác nhận thanh toán</Button>
      </form>
    </Form>
  );
}
