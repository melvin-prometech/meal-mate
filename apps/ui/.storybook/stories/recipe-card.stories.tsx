import type { Meta, StoryObj } from "@storybook/nextjs";
import type { RecipeResponseDto } from "@meal-mate/schemas";
import { RecipeCard } from "../../features/recipes/recipe-card";

const recipe: RecipeResponseDto = {
  id: "8f0f3c3a-0ea2-4a1d-9f54-3518164e12b6",
  title: "Pasta Carbonara",
  description: "A classic Roman pasta with a silky egg and pecorino sauce.",
  instructions: "Cook the pasta. Toss with pancetta, egg, and pecorino.",
  prepTime: 20,
  servings: 4,
  createdBy: "123456789",
  ingredients: [
    {
      id: "a53cc117-1f38-40f8-84f5-82fdf5875ae8",
      quantity: null,
      unit: null,
      notes: null,
      ingredient: { id: "1cc89a87-27df-4f44-b285-fec28e197f83", name: "Spaghetti" },
    },
    {
      id: "b29f819e-624a-4d3b-82da-3f42d18d4c6c",
      quantity: null,
      unit: null,
      notes: null,
      ingredient: { id: "188f102a-e99b-4245-9b05-7b26568f0012", name: "Pancetta" },
    },
    {
      id: "221a787c-95a8-4667-88e5-60159be40b71",
      quantity: null,
      unit: null,
      notes: null,
      ingredient: { id: "875f1c2d-bf40-4f2e-a462-b27d7c39cd12", name: "Eggs" },
    },
    {
      id: "61c33559-56c9-4589-ab0f-301f9c12566a",
      quantity: null,
      unit: null,
      notes: null,
      ingredient: { id: "65389acb-7905-4942-b053-3621185c9772", name: "Pecorino Romano" },
    },
  ],
  createdAt: new Date("2025-01-15T12:00:00.000Z"),
  updatedAt: new Date("2025-01-15T12:00:00.000Z"),
};

const meta = {
  title: "Recipes/RecipeCard",
  component: RecipeCard,
  args: { recipe },
  parameters: { layout: "centered" },
} satisfies Meta<typeof RecipeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PastaCarbonara: Story = {};
