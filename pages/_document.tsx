import { Html, Head, Main, NextScript } from "next/document";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function Document() {
  return (
    <Html lang="en">
      <Head title={metadata.title}>
        <meta name="description" content={metadata.description} />
      </Head>
      <body>
        <Main />
        <Toaster />
        <NextScript />
      </body>
    </Html>
  );
}
