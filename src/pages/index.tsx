import { Button, Text, ToastId, useToast } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useEffect, useRef } from "react";
import Chat from "../components/Chat/chat";
import { useWsClient } from "../utils/socketContext";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    ActionheroWebsocketClient: any;
  }
}

const Home: NextPage = () => {
  const toast = useToast();
  const matchmakingToast = useRef<ToastId>();
  console.log("RENDER HOME");
  const { subscribe, clientState, client } = useWsClient();

  // todo
  /* useSubscribe("game", (message: any) => {
    console.log("RECEBI MESSAGE DE GAME", { message });
  }); */

  useEffect(() => {
    if (clientState !== "connected") {
      return;
    }
    subscribe("game", (message: any) => {
      console.log("RECEBI MESSAGE DE GAME", { message });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientState]);

  return (
    <>
      <Chat />

      <Text as="h1" color="brand.500">
        Potential Brocolli
      </Text>

      <Button
        colorScheme="brand"
        onClick={() => {
          client?.action("startMatchmaking", {}, (data: any) => {
            console.log({ data });
            if (data.ok && !data.gameHasStarted) {
              matchmakingToast.current = toast({
                title: "Matchmaking...",
                status: "success",
                duration: null,
                isClosable: false,
                position: "top-right",
              });
            }
          });
        }}
      >
        Matchmaking
      </Button>

      {/* <Text>
        This is oldbook.css. It&apos;s a single drag and drop css file that
        applies a clean, old-school parchment style to your sites. Here&apos;s
        <span>
          {" "}
          <Text as="b" fontWeight="normal" color="brand.500">
            bold
          </Text>
        </span>{" "}
        text, here&apos;s <i>italic</i> text.
      </Text>

      <ul>
        <li>Unordered list item</li>
      </ul>
      <ol>
        <li>Ordered list item</li>
      </ol>

      <Text className="has-dropcap" mt={4}>
        Use the class "has-dropcap" to add dropcaps to the start of paragraphs.
        Testing testing testing, how does this even work as a drop cap thing
        anyways. Testing testing testing, how does this even work as a drop cap
        thing anyways. Testing testing testing, how does this even work as a
        drop cap thing anyways. Testing testing testing, how does this even work
        as a drop cap thing anyways.
      </Text>

      <Flex align="center">
        <Text color="brand.500" as="h1" textDecor="underline">
          consegue esmagar esta rata
        </Text>
        <Button ml={3} colorScheme="brand" size="sm" variant="outline">
          Esmaga
        </Button>
      </Flex>
      <h1>kkk</h1>
      <blockquote>Blockquote</blockquote>

      <table>
        <tr>
          <th>Firstname</th>
          <th>Lastname</th>
        </tr>
        <tr>
          <td>A</td>
          <td>B</td>
        </tr>
        <tr>
          <td>C</td>
          <td>D</td>
        </tr>
      </table>
      <Box mt={10} /> */}
    </>
  );
};

export default Home;
