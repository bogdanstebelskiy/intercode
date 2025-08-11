import { Unit } from '../enums/unit.enum';

export interface Ingredient {
  name: string;
  amount: number;
  unit: Unit;
}
