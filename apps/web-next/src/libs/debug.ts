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
          filename,
          lineNumber: parseInt(lineNumber, 10), // Parse the line number string to a number
        };
      }
    }
  }

  console.warn('Could not parse the error stack.');
  return undefined;
}
