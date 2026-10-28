import { Card } from '@/components/ui/Card';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Card className="py-12 text-center">
      <h2 className="text-xl font-semibold text-brown">{title}</h2>
      <p className="mt-2 text-sm text-text-muted">{description}</p>
    </Card>
  );
}
