import { AppProps } from "next/app";
import Layout from "@/app/layout_pages";
import Header from "@/components/shared/header/Header";
import Main from "@/components/shared/main/Main";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Header />
      <Main>
        <Component {...pageProps} />
      </Main>
    </Layout>
  );
}
