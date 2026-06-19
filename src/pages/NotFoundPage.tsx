import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 text-center">
      <div className="relative mb-6">
        <div className="flex h-24 w-32 items-center justify-center rounded-lg border-2 border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-gray-300" />
            <span className="h-2 w-2 rounded-full bg-gray-300" />
            <span className="h-3 w-4 rounded-full border border-gray-300" />
          </div>
        </div>
        <div className="absolute -right-6 -top-4 rounded-lg border-2 border-danger bg-white px-3 py-1 shadow-md">
          <span className="text-2xl font-black text-brown">404</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-wide text-brown sm:text-3xl">
        PAGE NOT FOUND
      </h1>
      <p className="mt-3 max-w-md text-sm text-text-muted">
        Sorry, we can&apos;t seem to find the page you&apos;re looking for. Are you
        sure the URL is correct? Try going back to the previous page or..
      </p>

      <Link to="/dashboard" className="mt-8">
        <Button>Go to your dashboard</Button>
      </Link>
    </div>
  );
}
