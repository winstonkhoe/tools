import { NavigationBarItem } from '@/components/Navigation';
import { routes } from '@/router/route';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-1 justify-center items-center'>
      <div className='flex flex-col items-center gap-10'>
        <h2 className='text-4xl font-bold lowercase'>Available Tools</h2>
        <div className='flex gap-10'>
          <Link href={`${routes?.binusEnrichment?.path}`}>
            <div className='relative flex flex-col items-center p-5 rounded-lg bg-primary-yellow-100/40 dark:bg-primary-black hover:cursor-pointer w-80 border-2 transition-colors border-transparent hover:border-primary-yellow-100/40'>
              <Image
                src='/automation-logbook-illustration.png'
                alt='Logbook Automation Illustration'
                className=''
                width={150}
                height={150}
                priority
              />
              <div className='flex flex-col gap-2 pt-4 items-center'>
                <h3 className='text-normal font-semibold lowercase text-center'>
                  Automation Enrichment Logbook
                </h3>
                <span className='text-normal font-normal opacity-70 dark:opacity-40 break-words lowercase text-center'>
                  automatically fill in your enrichment logbook based on excel
                  file
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
