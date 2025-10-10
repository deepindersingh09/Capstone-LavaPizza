import React from 'react';
import DeliveryForm, { DeliveryValues } from '../../components/DeliveryForm';
import { useRouter } from 'expo-router';

export default function DeliveryStep3() {
  const router = useRouter();
  const initial: DeliveryValues = {
    address: '3301 – 1st Avenue Northwest',
    city: 'Calgary',
    postal: 'T2M 0L4',
    province: 'Alberta',
    country: 'Canada',
  };

  return (
    <DeliveryForm
      title="Delivery"
      values={initial}
      saveLabel="SAVE"
      onSave={() => {
        router.back();
      }}
    />
  );
}
