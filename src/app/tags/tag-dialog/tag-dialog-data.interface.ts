import { Mode } from 'src/app/_enums/mode.enum';
import { Tag } from 'src/app/_interfaces/tag.interface';

export interface TagDialogData {
  mode: Mode;
  tag?: Tag;
}
