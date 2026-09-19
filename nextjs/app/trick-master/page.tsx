import React from 'react';
import { TrickMaster } from '@/_pages/trickMaster';
import type { EquipmentOption, CategoryOption, StateOption } from '@/_pages/trickMaster/types';

const GO_API_URL = process.env.GO_API_URL ?? 'http://localhost:8080';

async function fetchList<T>(path: string): Promise<T[]> {
  try {
    const response = await fetch(`${GO_API_URL}${path}`, { cache: 'no-store' });
    const json = await response.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

const TrickMasterPage: React.FC = async () => {
  const [equipmentOptions, categoryOptions, stateOptions] = await Promise.all([
    fetchList<EquipmentOption>('/api/equipments'),
    fetchList<CategoryOption>('/api/equipment-categories'),
    fetchList<StateOption>('/api/states'),
  ]);

  return (
    <div className="p-32">
      <h1 className="mb-24">技マスタ登録</h1>
      <TrickMaster
        equipmentOptions={equipmentOptions}
        categoryOptions={categoryOptions}
        stateOptions={stateOptions}
      />
    </div>
  );
};

export default TrickMasterPage;
