import { useMemo, useState } from "react";
import {
  Search,
  Users as UsersIcon,
  ShieldCheck,
  UserCheck,
  Trash2,
  Mail,
  CalendarDays,
} from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";
import PageLoader from "../../../components/common/PageLoader";
import {
  useAdminUsers,
  useDeleteAdminUser,
  useUpdateAdminUserRole,
} from "../hook/useAdminUsers";

function Users() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const { data: users = [], isLoading, isError, error } = useAdminUsers();
  const updateRole = useUpdateAdminUserRole();
  const deleteUser = useDeleteAdminUser();

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user._id?.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleRoleChange = (user, role) => {
    if (role === user.role) return;

    updateRole.mutate({ id: user._id, role });
  };

  const handleDelete = (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name || user.email}?`,
    );

    if (confirmed) {
      deleteUser.mutate(user._id);
    }
  };

  const stats = [
    {
      label: "Total users",
      value: users.length,
      icon: UsersIcon,
    },
    {
      label: "Students",
      value: users.filter((user) => user.role === "user").length,
      icon: UserCheck,
    },
    {
      label: "Admins",
      value: users.filter((user) => user.role === "admin").length,
      icon: ShieldCheck,
    },
  ];

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        {error.response?.data?.message || "Unable to load users."}
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title="User Management"
        description="View users, manage account roles, and control platform access."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-surface p-5  "
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground-secondary ">
                {label}
              </p>
              <Icon size={20} className="text-brand-secondary" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-foreground ">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5  ">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-secondary"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground outline-none focus:border-brand-secondary   dark:text-white"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none   dark:text-white"
          >
            <option value="all">All roles</option>
            <option value="user">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-212.5 text-left">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-foreground-secondary  ">
                <th className="px-4 py-4 font-semibold">ID</th>
                <th className="px-4 py-4 font-semibold">User</th>
                <th className="px-4 py-4 font-semibold">Role</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold">Joined</th>
                <th className="px-4 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-border last:border-0 "
                >
                  <td className="px-4 py-4 text-xs text-foreground-secondary">{user._id || "—"}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar?.url || "/images/default-avatar.svg"}
                        alt={user.name || "User"}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(event) => { event.currentTarget.src = "/images/default-avatar.svg"; }}
                      />
                      <div>
                        <p className="font-medium text-foreground ">
                          {user.name || "Unnamed user"}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-foreground-secondary ">
                          <Mail size={12} />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-surface-secondary px-3 py-1.5 text-xs font-medium capitalize text-foreground  ">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        user.isVerified
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300"
                      }`}
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm text-foreground-secondary ">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={14} />
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <select
                        value={user.role}
                        disabled={updateRole.isPending}
                        onChange={(event) =>
                          handleRoleChange(user, event.target.value)
                        }
                        className="rounded-lg border border-border bg-background px-2 py-2 text-xs text-foreground outline-none   dark:text-white"
                      >
                        {!["user", "instructor", "admin"].includes(user.role) && (
                          <option value={user.role}>{user.role}</option>
                        )}
                        <option value="user">User</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        disabled={deleteUser.isPending}
                        aria-label={`Delete ${user.name || user.email}`}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-foreground-secondary"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-foreground-secondary ">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>
    </div>
  );
}

export default Users;
