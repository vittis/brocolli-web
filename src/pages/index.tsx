import { Button, Input, Text, ToastId, useToast } from "@chakra-ui/react";
import type { NextPage } from "next";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    ActionheroWebsocketClient: any;
  }
}

const Home: NextPage = () => {
  const [client, setClient] = useState<any>();
  const [input, setInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const toast = useToast();
  const matchmakingToast = useRef<ToastId>();

  useEffect(() => {
    if (!client) {
      return;
    }

    client.on("say", (message) => {
      console.log("SAY", { message });

      if (message.room === "lobby") {
        setChatMessages([...chatMessages, message.message]);
      }

      if (message.room === "matchmaking") {
        if (message.message === "this room has been deleted") {
          if (matchmakingToast.current) {
            toast.close(matchmakingToast.current);
          }
        }
      }

      if (message.room.includes("game")) {
        if (message.message === "INICIA JOGO") {
          setChatMessages([...chatMessages, "COMEÇANDO JOGO"]);
        }
      }
    });
  }, [client, chatMessages, toast]);

  useEffect(() => {
    if (!client) {
      return;
    }

    client.on("connected", function () {
      console.log("connected!");
    });

    client.on("disconnected", function () {
      console.log("disconnected :(");
    });

    client.on("alert", function (message) {
      console.warn("ALERT", { message });
    });

    client.on("api", function (message) {
      console.warn("API", { message });
    });

    client.on("error", function (error) {
      console.log("error", error.stack);
    });

    client.on("reconnect", function () {
      console.log("reconnect");
    });

    client.on("reconnecting", function () {
      console.log("reconnecting");
    });

    client.on("welcome", (message) => {
      console.log("WELCOME", { message });
    });

    console.log("connecting...");
    client.connect((error: any, details: any) => {
      console.log("details", details);
      if (error != null) {
        console.log(error);
      } else {
        client.roomAdd("lobby");
        console.log("joined lobby");
        console.log(client);
      }
    });
  }, [client]);

  return (
    <>
      <Script
        onLoad={() => {
          const client = new window.ActionheroWebsocketClient({
            url: "http://localhost:8080",
          });

          setClient(client);
        }}
        src="./ActionheroWebsocketClient.min.js"
      />

      <Text as="h1" color="brand.500">
        Potential Brocolli
      </Text>

      <Input value={input} onChange={(e) => setInput(e.target.value)} />

      <Button
        onClick={() => {
          client.say("lobby", input);
          setInput("");
          // list lobby players
          /* client.roomView("lobby", (data) => {
            console.log({ data });
          }); */
        }}
      >
        aaaaa
      </Button>

      <Button
        colorScheme="brand"
        onClick={() => {
          client.action("startMatchmaking", {}, (data) => {
            console.log({ data });
            if (data.ok && !data.gameHasStarted) {
              matchmakingToast.current = toast({
                title: "Matchmaking...",
                description: "xiba",
                status: "success",
                duration: null,
                isClosable: false,
              });
            }
          });
        }}
      >
        Matchmaking
      </Button>

      <ul>
        {chatMessages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>

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
