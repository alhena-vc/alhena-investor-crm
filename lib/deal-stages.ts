import { supabaseRest } from "@/lib/supabase-server";

export type DealStage = {
  id: string;
  code: string;
  title: string;
  sort_order: number;
  is_active: boolean;
};

const stageFields = "id,code,title,sort_order,is_active";

export async function listDealStages() {
  return await supabaseRest<DealStage[]>(
    `deal_stages?select=${stageFields}&is_active=is.true&order=sort_order.asc`,
  );
}
