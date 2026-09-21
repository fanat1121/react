export type EquipmentOption = {
  id: number;
  name: string;
};

export type CategoryOption = {
  id: number;
  equipment_id: number;
  name: string;
};

export type StateOption = {
  id: number;
  equipment_id: number;
  name: string;
};

export type TrickDetailResponse = {
  id: number;
  equipment_id: number;
  equipment_name: string;
  category_id: number;
  category_name: string;
  name: string;
  description?: string;
  start_state_id: number;
  start_state_name: string;
  end_state_id: number;
  end_state_name: string;
  video_url?: string;
  estimated_duration_seconds: number;
  created_at: string;
  updated_at: string;
};
