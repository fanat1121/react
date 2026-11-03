import type { EquipmentOption } from '../types';

const GO_API_URL = process.env.GO_API_URL ?? 'http://localhost:8080';

export async function fetchEquipmentOptions(): Promise<EquipmentOption[]> {
  try {
    const response = await fetch(`${GO_API_URL}/api/equipments`, { cache: 'no-store' });
    const json = await response.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}
