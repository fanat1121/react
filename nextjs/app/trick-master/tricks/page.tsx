import React from 'react';
import { TrickSearchContainer } from '@/_pages/trickMaster';
import { fetchEquipmentOptions } from '@/_pages/trickMaster/api/fetchEquipmentOptions';

const TrickSearchPage: React.FC = async () => {
  const equipmentOptions = await fetchEquipmentOptions();

  return (
    <div className="p-32">
      <h1 className="mb-24">技検索</h1>
      <TrickSearchContainer equipmentOptions={equipmentOptions} />
    </div>
  );
};

export default TrickSearchPage;
