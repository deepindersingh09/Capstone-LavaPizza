import React from 'react';
import DeliveryForm, { DeliveryValues } from '../../components/DeliveryForm';
import { useRouter } from 'expo-router';

export default function DeliveryStep1() {
  const router = useRouter();
  const initial: DeliveryValues = {
    address: '3301 – 1st Avenue Northwest',
    city: 'Calgary',
    province: 'Alberta',
    country: 'Canada',
  };

  return (
    <DeliveryForm
      title="Delivery"
      values={initial}
      saveLabel="SAVE"
      onSave={(vals) => {
        // Persist to state/store if you have one, then go next
        router.push('/delivery/step2');
      }}
    />
  );
}

