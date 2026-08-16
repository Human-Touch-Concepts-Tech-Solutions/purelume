import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";

const geistSans = Geist({
  variable: "--heading",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--body",
  subsets: ["latin"],
});

export const metadata = {
  title: "Purelume | Luxury Jewelry",
  description: "Luxury Jewelry E-Commerce Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}