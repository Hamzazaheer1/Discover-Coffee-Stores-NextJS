import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang=" en">
      <Head>
        <link
          rel="preload"
          hre="/fonts/IBMPlexSans-bold.tff"
          as="font"
          crossOrigin="anonymous"
        ></link>
        <link
          rel="preload"
          hre="/fonts/IBMPlexSans-regular.tff"
          as="font"
          crossOrigin="anonymous"
        ></link>
        <link
          rel="preload"
          hre="/fonts/IBMPlexSans-SemiBold.tff"
          as="font"
          crossOrigin="anonymous"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
