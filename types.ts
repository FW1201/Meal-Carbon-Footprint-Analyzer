
export interface Ingredient {
  name: string;
  amount: string;
  carbonFootprint: number;
}

export interface CarbonFootprintReport {
  dishName: string;
  totalCarbonFootprint: number;
  ingredients: Ingredient[];
  summary: string;
}
