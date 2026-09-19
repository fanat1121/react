import { Tabs } from '@/components/common/ui/Tabs';
import { EquipmentFormContainer } from './equipment/components/EquipmentForm/EquipmentFormContainer';
import { CategoryFormContainer } from './category/components/CategoryForm/CategoryFormContainer';
import { StateFormContainer } from './state/components/StateForm/StateFormContainer';
import { TrickFormContainer } from './trick/components/TrickForm/TrickFormContainer';
import type { EquipmentOption } from './types';

type TrickMasterProps = {
  equipmentOptions: EquipmentOption[];
};

export const TrickMaster: React.FC<TrickMasterProps> = ({ equipmentOptions }) => {
  return (
    <Tabs
      items={[
        { key: 'equipment', label: '道具', content: <EquipmentFormContainer /> },
        { key: 'category', label: 'カテゴリ', content: <CategoryFormContainer equipmentOptions={equipmentOptions} /> },
        { key: 'state', label: '状態', content: <StateFormContainer equipmentOptions={equipmentOptions} /> },
        { key: 'trick', label: '技', content: <TrickFormContainer equipmentOptions={equipmentOptions} /> },
      ]}
    />
  );
};
