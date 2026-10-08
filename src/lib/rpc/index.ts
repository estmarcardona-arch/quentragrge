import { createClient } from "../db/server";

export async function callRpc<T = unknown>(
  rpcName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args?: Record<string, any>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc(rpcName, args);

    if (error) {
      console.error(`RPC Error [${rpcName}]:`, error);
      return { data: null, error: error.message };
    }

    return { data: data as T, error: null };
  } catch (err: unknown) {
    console.error(`RPC Exception [${rpcName}]:`, err);
    return { data: null, error: err instanceof Error ? err.message : "Unknown server error" };
  }
}
