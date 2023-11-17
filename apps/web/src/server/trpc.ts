import { initTRPC } from '@trpc/server';
import log from '@/libs/logger';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

// trpc log helper
export function logTrpc(err: Error, inputs: any, start: number, msg: string) {
  log().Debug(err, [
    { k: 'src', v: 'trpc' },
    { k: 'duration(ms)', v: Math.floor(performance.now() - start) },
    { k: 'msg', v: msg },
    // { k: 'inputs', v: JSON.stringify(inputs) },
  ]);
}
