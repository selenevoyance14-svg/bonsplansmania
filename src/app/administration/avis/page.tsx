import type { Metadata } from "next";
import ReviewModeration from "@/app/components/ReviewModeration";

export const metadata: Metadata = {
  title: "Modération des avis",
  robots: { index: false, follow: false, noarchive: true },
};

export default function ReviewAdministrationPage() {
  return <ReviewModeration />;
}
