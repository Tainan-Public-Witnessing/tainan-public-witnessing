import { Mode } from 'src/app/_enums/mode.enum';
import { Congregation } from 'src/app/_interfaces/congregation.interface';

export interface CongregationDialogData {
  mode: Mode;
  congregation?: Congregation;
}
