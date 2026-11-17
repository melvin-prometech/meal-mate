import { Suspense } from "react";
import { redirect } from "next/navigation";
import { UserRole } from "@meal-mate/schemas";
import { requireAuth } from "@/features/auth/auth";
import { getUsers } from "@/features/users/data/get-users";
import { DeleteUserButton } from "@/features/users/components/delete-user-button";

export default async function UsersPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-svh w-full max-w-8xl flex-col px-6 py-8 text-sm text-muted-foreground sm:px-10">
          Loading users…
        </main>
      }
    >
      <UsersContent />
    </Suspense>
  );
}

async function UsersContent() {
  const { user } = await requireAuth();
  if (user.role !== UserRole.ADMIN) redirect("/");

  const users = await getUsers();

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-8xl flex-col px-6 py-8 sm:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-sm text-muted-foreground">Manage MealMate accounts</p>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
      </header>

      {users.length === 0 ? (
        <p className="text-sm text-muted-foreground">No users found.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Name</th>
                <th scope="col" className="px-4 py-3 font-medium">Email</th>
                <th scope="col" className="px-4 py-3 font-medium">Role</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 font-medium">{user.firstName} {user.lastName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3 text-right">
                    <DeleteUserButton userId={user.id} userName={`${user.firstName} ${user.lastName}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
