"use client"

import ChallengeCard from '@/components/ChallengeCard';
import GameCard from '@/components/GameCard';
import Leaderboard from '@/components/Leaderboard';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <main className='flex-1 px-4 py-8 sm:px-6 lg:px-8'>
        <section className="mb-8">

          <div className='flex items-center justify-between'>
            <h2 className="text-2xl font-bold">Ongoing Matches</h2>
            {/* TODO: Show View All only if ongoing game > 3 */}
            <Button variant="ghost">View All</Button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <GameCard />
            <GameCard />
            <GameCard />
          </div>
        </section>

        <section className="mb-8">
          <div className='flex items-center justify-between'>
            <h2 className="text-2xl font-bold">Leaderboard</h2>
            <Button variant="ghost">View All</Button>
          </div>
          <Leaderboard />
        </section>

        <section>
          <div className='flex items-center justify-between'>
            <h2 className="text-2xl font-bold">Upcoming Challenges</h2>
            <Button variant="ghost">View All</Button>
          </div>
          <div className='mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            <ChallengeCard title='Sorting Algorithms' subtitle='Implement efficient sorting algorithms' challenge='Implement a merge sort algorithm' />
            <ChallengeCard title='Data Structures' subtitle='Implement common data structures' challenge='Implement a binary search tree' />
            <ChallengeCard title='Dynamic Programming' subtitle='Solve dynamic programming problems' challenge='Implement a fibonacci sequence solver' />
          </div>
        </section>
      </main>
    </div>
  )
}
