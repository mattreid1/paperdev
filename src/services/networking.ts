import net from "node:net";

interface IsPortReachableOptions {
  host: string;
  timeout: number;
}

// Adapted from https://github.com/sindresorhus/is-port-reachable
export async function isPortReachable(
  port: number,
  { host, timeout = 1000 }: IsPortReachableOptions
) {
  if (typeof host !== "string") {
    throw new TypeError("Specify a `host`");
  }

  const promise = new Promise<void>((resolve, reject) => {
    const socket = new net.Socket();

    const onError = () => {
      socket.destroy();
      reject();
    };

    socket.setTimeout(timeout);
    socket.once("error", onError);
    socket.once("timeout", onError);

    socket.connect(port, host, () => {
      socket.end();
      resolve();
    });
  });

  try {
    await promise;
    return true;
  } catch {
    return false;
  }
}
