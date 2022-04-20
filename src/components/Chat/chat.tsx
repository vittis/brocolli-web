import { ChatIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Input,
  Text,
  useBoolean,
} from "@chakra-ui/react";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useWsClient } from "../../utils/socketContext";

interface ChatMessage {
  senderName: string;
  body: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatOpen, setChatOpen] = useBoolean(true);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { subscribe, clientState, client } = useWsClient();
  console.log("RENDER CHAT");

  useEffect(() => {
    if (clientState !== "connected") {
      return;
    }
    subscribe("lobby", (message: any) => {
      console.log("RECEBI MESSAGE DE LOBBY", { message });
      setMessages((msgs) => [
        ...msgs,
        { senderName: message.from.substring(0, 6), body: message.message },
      ]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientState]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (chatOpen) {
      inputRef?.current?.focus();
    }
    if (chatOpen && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatOpen]);

  if (!chatOpen) {
    return (
      <Box position="fixed" left="4" bottom="4">
        <IconButton
          onClick={setChatOpen.toggle}
          colorScheme="brand"
          rounded="full"
          icon={<ChatIcon />}
          aria-label="Open Chat"
          size="lg"
        />
      </Box>
    );
  }

  return (
    <Box position="fixed" left="2" bottom="2">
      <Flex
        direction="column"
        minW="xs"
        maxW="xs"
        borderWidth="2px"
        borderRadius="lg"
        borderColor="#8b0000"
        pt={2}
        pb={0}
      >
        <IconButton
          variant="ghost"
          position="absolute"
          _hover={{ bg: "#8b0000", color: "white" }}
          top="0"
          right="0"
          onClick={setChatOpen.toggle}
          colorScheme="gray"
          icon={<ChevronDownIcon />}
          aria-label="Close Chat"
        />
        <Box
          ref={chatBoxRef}
          onClick={() => inputRef.current?.focus()}
          minHeight="165px"
          maxHeight="165px"
          flex={1}
          mb="3"
          overflowY="scroll"
          px={2}
        >
          {messages.map((message, index) => {
            return (
              <React.Fragment key={index}>
                {message.senderName ? (
                  <Text fontSize="md">
                    <Box as="b">{message.senderName}:</Box> {message.body}
                  </Text>
                ) : (
                  <Text color="orange.400" fontSize="md">
                    {message.body}
                  </Text>
                )}
              </React.Fragment>
            );
          })}
        </Box>
        <Box
          as="form"
          borderTop="2px solid #8b0000"
          mr="-2px"
          ml="-2px"
          //@ts-ignore
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            client?.say("lobby", inputRef.current?.value);
            if (inputRef.current?.value) {
              inputRef.current.value = "";
            }
          }}
        >
          <Input
            w="100%"
            ref={inputRef}
            placeholder="Speak thy mind, friend"
            border="none"
            _focus={{ border: "none" }}
            _hover={{ border: "none" }}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Chat;
