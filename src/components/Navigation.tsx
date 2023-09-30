import { routes } from '@/router/route';
import Link from 'next/link';

interface Props {
  href: string;
  text: string;
}

const NavigationBarItem = ({ href, text }: Props) => {
  return (
    <Link href={`${href}`}>
      <div className='rounded-lg border border-transparent px-3 py-3 transition-colors hover:bg-primary-yellow-100/40'>
        {text}
      </div>
    </Link>
  );
};

const NavigationBar = () => {
  return (
    <div className='relative w-full items-center font-mono text-sm flex px-6 md:px-14 py-6 md:py-10 gap-4'>
      {Object.entries(routes).map(([key, route], index) => {
        return (
          <NavigationBarItem
            key={key}
            href={route?.path}
            text={route?.text}
          />
        );
      })}
    </div>
  );
};

export { NavigationBar, NavigationBarItem };
