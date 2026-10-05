import SellerProfileForm from "@/components/seller/seller-profile-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Profile | EliteMart",
  description:
    "Complete and manage your EliteMart seller business profile.",
};

export default function SellerProfilePage() {
  return <SellerProfileForm />;
}
