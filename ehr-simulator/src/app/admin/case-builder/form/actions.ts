"use server"

import { createClient } from "@supabase/supabase-js"
import { RpcFunction } from "@/lib/supabase/rpc"

export async function saveCaseData(payload: any, rpcFunction: RpcFunction) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase.rpc(rpcFunction, {
    payload: payload,
  });
  if (error) throw new Error(error.message);
  return data;
}
