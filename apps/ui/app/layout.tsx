import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MealMate",
  description: "Recipes and meal planning for your household.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="font-sans">
      <body>{children}</body>
    </html>
  );
}
