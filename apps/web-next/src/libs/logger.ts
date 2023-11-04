/**
 * @packageDocumentation
 * @module libs/logging
 */

type Logger = {
  Debug: (err: Error, msg: string) => void;
  Info: (err: Error, msg: string) => void;
  Warn: (err: Error, msg: string) => void;
  Error: (err: Error, msg: string) => void;
};

export var logger: Logger;

export default function log(): Logger {
  if (!logger) logger = NewLogger();
  return logger;
}

function NewLogger(): Logger {
  const debug = process.env.NEXT_PUBLIC_DEBUG === 'true';
  const src = typeof window === 'undefined' ? 'server' : 'client';

  return {
    Debug: (err: Error, msg: string) => {
      debug && print('debug', src, err, msg);
    },
    Info: (err: Error, msg: string) => {
      print('info', src, err, msg);
    },
    Warn: (err: Error, msg: string) => {
      print('warn', src, err, msg);
    },
    Error: (err: Error, msg: string) => {
      print('warn', src, err, msg);
    },
  };
}

function print(level: string, src: string, err: Error, msg: string) {
  const c = caller(err);
  const d = new Date();
  const m = {
    level: level,
    // source: src,
    caller: `${c?.filename}:${c?.lineNumber}`,
    time: d.getTime(),
    message: msg,
  };
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
