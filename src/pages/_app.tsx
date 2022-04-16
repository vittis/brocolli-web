import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import oldbookGlobal from "../styles/oldbook";
import "../styles/oldbook.css";

const theme = extendTheme({
  styles: {
    ...oldbookGlobal,
  },
  colors: {
    brand: {
      "50": "#fceae1",
      "100": "#F9D8C7",
      "200": "#F3AB92",
      "300": "#DC6E58",
      "400": "#B93A2E",
      "500": "#8B0000",
      "600": "#77000A",
      "700": "#640011",
      "800": "#500014",
      "900": "#420017",
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
