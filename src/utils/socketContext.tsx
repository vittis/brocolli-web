import Script from "next/script";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const SOCKET_SERVER_URL = "http://localhost:8080";

interface ReceiveSocketMessage {
  room: string;
  message: any;
}

interface SocketContextType {
  // eslint-disable-next-line no-unused-vars
  subscribe: (targetRoom: string, targetCallback: Function) => void;
  clientState: string;
  client: any;
}

const SocketContext = createContext<SocketContextType>({
  subscribe: () => {
    throw new Error("Must use SocketProvider");
  },
  clientState: "",
  client: undefined,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [clientState, setClientState] = useState<string>("disconnected");

  const clientRef = useRef<any>(); //todo type Client
  const [callbacks, setCallbacks] = useState<{ [key: string]: Function }>({});

  const subscribe = (targetRoom: string, targetCallback: Function) => {
    console.log("subbing");
    setCallbacks((cbs) =>
      cbs[targetRoom] ? cbs : { ...cbs, [targetRoom]: targetCallback }
    );
  };

  useEffect(() => {
    if (clientState !== "connected" || Object.keys(callbacks).length === 0) {
      return;
    }

    console.log("SETTING CALLBACKS", callbacks);
    clientRef.current.on("say", (socketMessage: ReceiveSocketMessage) => {
      console.log("on - say: ", { socketMessage });
      const targetSubscription = Object.keys(callbacks).find((subscription) =>
        socketMessage.room.includes(subscription)
      );

      if (targetSubscription) {
        callbacks[targetSubscription](socketMessage);
      }
    });
  }, [clientState, callbacks]);

  const updateClientState = (status: string) => {
    if (clientState !== status) {
      setClientState(status);
    }
  };

  const setupClient = (client: any) => {
    clientRef.current = client;

    client.on("connected", () => {
      console.log("ON - connected");
      updateClientState(clientRef.current.state);
    });

    client.on("disconnected", () => {
      console.log("ON - disconnected");
      updateClientState(clientRef.current.state);
    });

    client.on("alert", (message: any) => {
      console.log("ON - ALERT", { message });
    });

    client.on("api", (message: any) => {
      console.log("ON - API", { message });
    });

    client.on("error", (error: any) => {
      console.log("ON - error", error.stack);
      updateClientState(clientRef.current.state);
    });

    client.on("reconnect", () => {
      console.log("ON - reconnect");
      // for some reason client.state at this step is connected instead of disconnected, so we manually set to 'disconnected'
      updateClientState("disconnected");
    });

    client.on("reconnecting", () => {
      console.log("ON - reconnecting");
      updateClientState(clientRef.current.state);
    });

    client.on("welcome", (message: any) => {
      console.log("ON - welcome", { message }, clientRef.current.state);
      updateClientState(clientRef.current.state);
    });

    client.connect((error: any, details: any) => {
      updateClientState(clientRef.current.state);
      if (error != null) {
        console.log(error);
      } else {
        client.roomAdd("lobby");
        console.log("joined lobby");
      }
    });
  };

  const state = useMemo(() => {
    return {
      subscribe,
      clientState,
      client: clientRef.current,
    };
  }, [clientState]);

  console.log("RENDER PROVIDER", { clientState });

  return (
    <>
      <Script
        onLoad={() => {
          const client = new window.ActionheroWebsocketClient({
            url: SOCKET_SERVER_URL,
          });
          setupClient(client);
        }}
        src="./ActionheroWebsocketClient.min.js"
      />

      <SocketContext.Provider value={state}>{children}</SocketContext.Provider>
    </>
  );
};

export const useWsClient = () => useContext(SocketContext);
