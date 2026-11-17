import { Suspense } from "react";
import { redirect } from "next/navigation";
import { UserRole } from "@meal-mate/schemas";
import { requireAuth } from "@/features/auth/auth";
import { getUsers } from "@/features/users/data/get-users";
import { DeleteUserButton } from "@/features/users/components/delete-user-button";
import { CreateUserDialog } from "@/features/users/components/create-user-dialog";
import { EditUserDialog } from "@/features/users/components/edit-user-dialog";

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
      <header className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Manage MealMate accounts</p>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        </div>
        <CreateUserDialog />
      </header>

      {users.length === 0 ? (
        <p className="text-sm text-muted-foreground">No users found.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-medium">Name</th>
                <th scope="col" className="px-4 py-3 text-center font-medium">Email</th>
                <th scope="col" className="px-4 py-3 text-center font-medium">Role</th>
                <th scope="col" className="w-0 whitespace-nowrap px-3 py-3 text-center font-medium">Update</th>
                <th scope="col" className="w-0 whitespace-nowrap px-3 py-3 text-center font-medium">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 text-left font-medium">{user.firstName} {user.lastName}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3 text-center">{user.role}</td>
                  <td className="w-0 whitespace-nowrap px-3 py-3 text-center">
                    <EditUserDialog user={user} />
                  </td>
                  <td className="w-0 whitespace-nowrap px-3 py-3 text-center">
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
