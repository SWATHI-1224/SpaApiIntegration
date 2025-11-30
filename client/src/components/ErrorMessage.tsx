import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullPage?: boolean;
}

export function ErrorMessage({ 
  title = 'Something went wrong', 
  message = 'We encountered an error while loading the content. Please try again.',
  onRetry,
  fullPage = false,
}: ErrorMessageProps) {
  const content = (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-muted-foreground text-sm">{message}</p>
          </div>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="gap-2" data-testid="button-retry">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (fullPage) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
}
