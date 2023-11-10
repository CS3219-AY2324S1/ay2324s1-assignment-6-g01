export type Question = {
  id: string;
  title: string;
  description: string;
  categories: string[];
  complexity: Complexity;
};

export enum Complexity {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}
