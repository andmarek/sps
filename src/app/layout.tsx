import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from '@radix-ui/themes';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roast My Music",
  description: "An app to roast you based on your Spotify playlists",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
        <body className={inter.className}><Theme appearance="dark" accentColor="green" grayColor="mauve">{children}</Theme></body>
      
    </html>
  );
}
