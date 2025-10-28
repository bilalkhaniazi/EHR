'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
// import { v4 as uuidv4 } from 'uuid';

export default function StartSimulationPage() {
  const router = useRouter();

  const handleStartNewSession = () => {
    const newSessionId = '123'
    router.push(`/simulation/${newSessionId}/chart/overview`);
  };

  return (
    <div className='h-screen w-full bg-lime-100 flex flex-col gap-4 items-center justify-center'>
      <h1 className='font-bold text-4xl'>Flex<span className='font-normal'>Chart</span></h1>
      <Button onClick={handleStartNewSession}>
        Start New Nursing Scenario
      </Button>
    </div>
  );
}