import { Fingerprint } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-headline text-xl font-bold">
      <div className="p-2">
        <Link href="/">
          <Fingerprint className="h-6 w-6 text-primary" />
        </Link>
      </div>
      <span className="text-primary dark:text-primary-foreground">Scryn</span>
    </div>
  );
}
