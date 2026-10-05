import SellerVerificationWorkspace from "@/components/seller/seller-verification-workspace";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Verification | EliteMart",
  description:
    "Manage seller verification documents and review EliteMart administration decisions.",
};

export default function SellerVerificationPage() {
  return <SellerVerificationWorkspace />;
}