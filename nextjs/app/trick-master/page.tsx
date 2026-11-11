import React from 'react';
import { TrickMaster } from '@/_pages/trickMaster';
import { fetchEquipmentOptions } from '@/_pages/trickMaster/api/fetchEquipmentOptions';

const TrickMasterPage: React.FC = async () => {
  const equipmentOptions = await fetchEquipmentOptions();

  return (
    <div className="p-32">
      <h1 className="mb-24">マスタ登録</h1>
      <TrickMaster equipmentOptions={equipmentOptions} />
    </div>
  );
};

export default TrickMasterPage;
