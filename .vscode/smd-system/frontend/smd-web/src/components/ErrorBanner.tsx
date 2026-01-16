import React from 'react';

interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: Props) {
  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
      <div className="flex items-center justify-between">
        <div className="text-sm text-red-800">{message}</div>
        {onRetry && (
          <button onClick={onRetry} className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
