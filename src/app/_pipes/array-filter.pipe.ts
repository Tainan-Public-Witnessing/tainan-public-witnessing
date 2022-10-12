import { Pipe, PipeTransform } from '@angular/core';

type FilterPredictionFn<T> = (item: T) => boolean;

@Pipe({
  name: 'arrayFilter',
  pure: true,
})
export class ArrayFilterPipe<T> implements PipeTransform {
  transform(value: T[], arg: FilterPredictionFn<T>): T[] {
    return value.filter(arg);
  }
}
