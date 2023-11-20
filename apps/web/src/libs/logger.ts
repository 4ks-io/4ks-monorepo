import { unstable_noStore as noStore } from 'next/cache';

/**
 * @packageDocumentation
 * @module libs/logging
 */

type Logger = {
  Debug: (err: Error, kv: KV[]) => void;
  Info: (err: Error, kv: KV[]) => void;
  Warn: (err: Error, kv: KV[]) => void;
  Error: (err: Error, kv: KV[]) => void;
};

export var logger: Logger;

export default function log(): Logger {
  if (!logger) logger = NewLogger();
  return logger;
}

// key value pairs
type KV = {
  k: string;
  v: string | number | boolean;
};

function NewLogger(): Logger {
  noStore();
  const debug = process.env.LOG_DEBUG === 'true';
  const src = typeof window === 'undefined' ? 'server' : 'client';

  return {
    Debug: (err: Error, kv: KV[]) => {
      debug && print('debug', src, err, kv);
    },
    Info: (err: Error, kv: KV[]) => {
      print('info', src, err, kv);
    },
    Warn: (err: Error, kv: KV[]) => {
      print('warn', src, err, kv);
    },
    Error: (err: Error, kv: KV[]) => {
      print('warn', src, err, kv);
    },
  };
}

function print(level: string, src: string, err: Error, keyValues: KV[]) {
  const c = caller(err);
  const d = new Date();
  let m = {
    level: level,
    // prints on server if server, client if client.
    // enable when client errors are sent to server
    // source: src,
    caller: `${c?.filename}:${c?.lineNumber}`,
    time: d.getTime(),
  } as any;
  for (let i = 0; i < keyValues.length; i++) {
    m[keyValues[i].k] = keyValues[i].v;
  }
  // keyValues.forEach((kv) => {
  //   m[kv.k] = kv.v;
  // });
  console.log(JSON.stringify(m));
}

export function caller(
  error: Error
): { filename: string; lineNumber: number } | undefined {
  const stack = error.stack;
  const stackPattern = /at .*\((.*):(\d+):(\d+)\)/i;

  if (stack) {
    // Split stack into lines and find the first relevant line (after this function itself)
    const lines = stack.split('\n').slice(1);
    for (let line of lines) {
      const match = stackPattern.exec(line);
      if (match) {
        const [, filename, lineNumber] = match;
        return {
          filename: filename.replace('rsc)/', ''),
          lineNumber: parseInt(lineNumber, 10), // Parse the line number string to a number
        };
      }
    }
  }

  console.warn('Could not parse the error stack.');
  return undefined;
}
