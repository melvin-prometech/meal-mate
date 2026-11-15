import type { Meta, StoryObj } from "@storybook/nextjs";
import { HouseholdRole, UserRole, type HouseholdResponseDto } from "@meal-mate/schemas";
import { HouseholdCard } from "../../features/households/components/household-card";
import { UserProvider } from "../../features/users/components/user-provider";

const currentUserId = "9b04a5aa-a980-4c65-9f0f-e68bbf56f405";

const household: HouseholdResponseDto = {
  id: "0a3f2a43-72be-4dc6-b370-f7a8b28c6e65",
  name: "The Maple Street House",
  createdAt: new Date("2025-01-15T12:00:00.000Z"),
  updatedAt: new Date("2025-01-15T12:00:00.000Z"),
  members: [
    {
      id: "9c590f24-97f9-41cc-ae28-5212210ad68c",
      userId: currentUserId,
      firstName: "Alex",
      lastName: "Morgan",
      role: HouseholdRole.ADMIN,
      joinedAt: new Date("2025-01-15T12:00:00.000Z"),
    },
    {
      id: "974c38cd-7b39-4958-b984-35515ce194e4",
      userId: "6af26f02-6acf-4338-854e-3c6dec44cefa",
      firstName: "Sam",
      lastName: "Lee",
      role: HouseholdRole.MEMBER,
      joinedAt: new Date("2025-02-01T12:00:00.000Z"),
    },
    {
      id: "e8e8e741-3ca0-4d3f-ac1c-a07e09bf2118",
      userId: "8e43a329-5488-4332-b7cb-80a0eead9cb3",
      firstName: "Jamie",
      lastName: "Patel",
      role: HouseholdRole.MEMBER,
      joinedAt: new Date("2025-02-10T12:00:00.000Z"),
    },
  ],
};

const meta = {
  title: "Households/HouseholdCard",
  component: HouseholdCard,
  args: { household, onJoin: () => undefined },
  decorators: [
    (Story) => (
      <UserProvider
        user={{
          id: currentUserId,
          firstName: "Alex",
          lastName: "Morgan",
          email: "alex@example.com",
          role: UserRole.USER,
        }}
      >
        <Story />
      </UserProvider>
    ),
  ],
  parameters: { layout: "centered" },
} satisfies Meta<typeof HouseholdCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveHousehold: Story = {};
