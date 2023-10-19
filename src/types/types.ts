export type Question = {
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
