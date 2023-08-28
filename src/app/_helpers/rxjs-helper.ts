import { map, tap } from 'rxjs';

export const log = (message: string) =>
  tap((value) => console.log(message, value));
