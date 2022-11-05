const noop = () => undefined;
export function extractPromise<T>() {
  let resolve: (data: T | Promise<T>) => void = noop;
  let reject: (reason: any) => void = noop;
  const promise = new Promise<T>((success, error) => {
    resolve = success;
    reject = error;
  });

  return { promise, resolve, reject };
}
