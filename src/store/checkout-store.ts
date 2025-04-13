import { create } from "zustand";

interface BuyNowItem {
  car_id: string;
  quantity: number;
}

interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
}

interface CheckoutStore {
  form: CheckoutForm;
  buyNowItem: BuyNowItem | null;
  setForm: (form: Partial<CheckoutForm>) => void;
  resetForm: () => void;
  setBuyNowItem: (item: BuyNowItem | null) => void;
}

const initialForm: CheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  paymentMethod: "cod", // Mặc định là thanh toán khi nhận hàng
};

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  form: initialForm,
  buyNowItem: null,
  setForm: (form) =>
    set((state) => ({
      form: {
        ...state.form,
        ...form,
      },
    })),
  resetForm: () => set({ form: initialForm }),
  setBuyNowItem: (item) => set({ buyNowItem: item }),
}));