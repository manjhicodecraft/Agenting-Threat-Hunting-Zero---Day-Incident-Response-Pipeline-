import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/DataState';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        title="This page is not part of the console"
        description="The view you requested does not exist. Return to the overview to continue monitoring."
        action={
          <Link to="/">
            <Button variant="primary">Back to overview</Button>
          </Link>
        }
      />
    </div>
  );
}
