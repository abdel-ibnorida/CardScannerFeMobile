import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/scansiona');
    }, 100); // 100 ms di ritardo

    return () => clearTimeout(timeout);
  }, []);

  return null;
}


