"use server"

import type { SupabaseClient } from "@supabase/supabase-js";

type OrderInput = {
  category?: string | null
  title?: string | null
  details?: string | null
  status?: string | null
  orderingProvider?: string | null
  important?: boolean | null
  visibleInPresim?: boolean | null
}

export async function updateOrders(
  supabase: SupabaseClient,
  orders: unknown[],
  caseId: string,
) {

  const { error: delErr } = await supabase
    .from("orders")
    .delete()
    .eq("case_id", caseId);

  if (delErr) throw new Error(delErr.message);
  if (orders.length === 0) return [];

  const rows = orders.map((o) => {
    const order = (o ?? {}) as OrderInput
    return {
    case_id: caseId,
    category: order.category,
    title: order.title,
    details: order.details,
    status: order.status,
    provider: order.orderingProvider,
    is_important: order.important,
    is_in_presim: order.visibleInPresim,
    }
  });

  const { data, error } = await supabase
    .from("orders")
    .insert(rows)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
