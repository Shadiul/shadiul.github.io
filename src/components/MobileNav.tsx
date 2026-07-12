import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const LINKS = [
  { href: '/projects', label: 'projects' },
  { href: '/blog', label: 'blog' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
  { href: '/uses', label: '/uses' },
  { href: '/now', label: '/now' },
];

export function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Open navigation">
            <Menu />
          </Button>
        }
      />
      <SheetContent side="right" className="w-64">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2.5 font-mono text-sm font-normal">
            <span
              className="size-[9px] rounded-full bg-primary shadow-[0_0_12px_var(--primary)]"
              aria-hidden="true"
            />
            shadiul<span className="text-faint">.github.io</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <a
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-2.5 font-mono text-[15px] transition-colors ${
                  active
                    ? 'bg-accent text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {l.label}
              </a>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
