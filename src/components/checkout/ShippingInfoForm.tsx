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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useCheckoutStore } from "@/store/checkout-store";
import type { ShippingInfo } from "@/store/checkout-store";
import { useEffect } from "react";

const shippingFormSchema = z.object({
  sameAsBilling: z.boolean(),
  fullName: z.string().min(1, "Vui lòng nhập họ tên").optional(),
  phone: z.string().min(10, "Số điện thoại không hợp lệ").optional(),
  address: z.string().min(1, "Vui lòng nhập địa chỉ").optional(),
});

export function ShippingInfoForm() {
  const { shippingInfo, setShippingInfo, billingInfo } = useCheckoutStore();

  const form = useForm<ShippingInfo>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: shippingInfo,
  });

  const sameAsBilling = form.watch("sameAsBilling");

  useEffect(() => {
    if (sameAsBilling) {
      form.setValue("fullName", billingInfo.fullName);
      form.setValue("phone", billingInfo.phone);
      form.setValue("address", billingInfo.address);
    }
  }, [sameAsBilling, billingInfo, form]);

  function onSubmit(data: ShippingInfo) {
    setShippingInfo(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="sameAsBilling"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Sử dụng thông tin thanh toán cho địa chỉ giao hàng
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {!sameAsBilling && (
          <>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên người nhận</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại người nhận</FormLabel>
                  <FormControl>
                    <Input placeholder="0123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ giao hàng</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Đường ABC, Quận XYZ, TP.HCM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit">Tiếp tục</Button>
      </form>
    </Form>
  );
} 