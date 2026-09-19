import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api/client';

interface AsyncState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Loads async data. Concurrent effect runs for the same tick (e.g. React Strict
 * Mode remount) share one in-flight promise so the network request is not
 * duplicated.
 */
export function useAsyncData<T>(
  loader: () => Promise<T>,
  initialData: T,
  deps: unknown[] = [],
): AsyncState<T> {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const loaderRef = useRef(loader);
  const inflightRef = useRef<{ key: string; promise: Promise<T> } | null>(null);

  loaderRef.current = loader;

  const reload = useCallback(() => setTick((value) => value + 1), []);

  useEffect(() => {
    let cancelled = false;
    const key = `${tick}:${deps.map(String).join('|')}`;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        let promise = inflightRef.current?.key === key
          ? inflightRef.current.promise
          : null;

        if (!promise) {
          promise = loaderRef.current();
          inflightRef.current = { key, promise };
          promise.finally(() => {
            // Keep briefly so Strict Mode's remount can reuse the same promise.
            queueMicrotask(() => {
              if (inflightRef.current?.key === key) {
                inflightRef.current = null;
              }
            });
          });
        }

        const result = await promise;
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : 'Something went wrong while loading data.';
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls deps
  }, [tick, ...deps]);

  return { data, loading, error, reload };
}
