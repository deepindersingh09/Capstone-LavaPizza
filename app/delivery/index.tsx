import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function DeliveryIndex() {
  const router = useRouter();
  useEffect(() => { router.replace('/delivery/step1'); }, []);
  return null;
}
