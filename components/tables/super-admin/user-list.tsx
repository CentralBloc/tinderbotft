"use client";

import {Edit, MoreHorizontal, Search, Trash, UserCheck, UserX} from "lucide-react"
import {useEffect, useMemo, useState} from "react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Switch} from "@/components/ui/switch"
import {useStats, useUsers} from "@/services/users/hooks";
import {usePlans} from "@/services/plans/hooks";
import {useSubscriptions} from "@/services/subscriptions/hooks";
import {Input} from "@/components/ui/input"
import {Overview} from "@/components/dashboard/overview"
import {RecentActivity} from "@/components/dashboard/recent-activity"
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "@/lib/axios";


export default function UsersList() {
  const {data: fetchedUsers = [], isLoading: isLoadingUsers, isError: isErrorUsers} = useUsers();
  const {data: fetchedPlans = [], isLoading: isLoadingPlans} = usePlans();
  const {data: fetchedSubscriptions = [], isLoading: isLoadingSubscriptions} = useSubscriptions();
  const {data: stats = [], isLoading: isLoadingStats} = useStats();

  const [users, setUsers] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState("");

  const queryClient = useQueryClient();

  // Update users state when fetchedUsers changes
  useEffect(() => {
    if (fetchedUsers && fetchedUsers.length > 0) {
      setUsers(fetchedUsers);
    }
  }, [fetchedUsers]);

  // Filter users based on filterValue
  const filteredUsers = useMemo(() => {
    return users.filter((user: any) => {
      const searchTerm = filterValue.toLowerCase();
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
      return (
        fullName.includes(searchTerm) ||
        (user.username || '').toLowerCase().includes(searchTerm) ||
        (user.email || '').toLowerCase().includes(searchTerm) ||
        (user.is_superuser ? 'admin' : 'user').includes(searchTerm) ||
        (user.is_active ? 'active' : 'inactive').includes(searchTerm)
      );
    });
  }, [users, filterValue]);

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((user: any) => user.is_active).length;
  const activeSubscriptions = fetchedSubscriptions.filter(sub => sub.status === 'active').length;
  const activePlans = fetchedPlans.length;

  // Calculate total revenue (sum of all active subscription plan prices)
  const totalRevenue: number = fetchedSubscriptions
    .filter(sub => sub.status === 'active')
    .reduce<number>((total: number, sub) => {
      if (typeof sub.plan === 'object' && sub.plan) {
        return total + (Number(sub.plan.price) || 0);
      }
      return total;
    }, 0);

  // Mutation for toggling user status
  const userStatusToggle = useMutation({
    mutationFn: async (userId: string) => {
      // Make the API call to toggle user status
      const response = await axios.patch(`/allow-access/${userId}/`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the users query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["users-list"],
      });
    },
  });

  const toggleUserStatus = (userId: string) => {
    // Optimistically update the UI
    setUsers(
      users.map((user: any) =>
        user.id === userId
          ? {
            ...user,
            is_active: !user.is_active,
          }
          : user,
      ),
    );

    // Call the API
    userStatusToggle.mutate(userId);
  };

  if (isLoadingUsers || isLoadingPlans || isLoadingSubscriptions || isLoadingStats) {
    return <div>Loading data...</div>;
  }

  if (isErrorUsers) {
    return <div>Error loading users. Please try again later.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers} active users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {totalUsers > 0 ? Math.round((activeSubscriptions / totalUsers) * 100) : 0}% of users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              ${activeSubscriptions > 0 ? (totalRevenue / activeSubscriptions).toFixed(2) : '0.00'} per subscription
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePlans}</div>
            <p className="text-xs text-muted-foreground">
              {fetchedPlans.map(plan => plan.name).join(', ')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview/>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Recent user and subscription activity</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity/>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground"/>
              <Input
                type="text"
                placeholder="Search users..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : filteredUsers.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.profile_picture?.link || "/placeholder.svg"} alt={user.username}/>
                        <AvatarFallback>{user.username ? user.username.charAt(0) : ''}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.first_name} {user.last_name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={user.is_active} onCheckedChange={() => toggleUserStatus(user.id)}/>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.is_superuser ? "Admin" : "User"}</Badge>
                  </TableCell>
                  <TableCell>{user.subscription?.plan?.name || "No Plan"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4"/>
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                          <Edit className="mr-2 size-4"/>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                          {user.is_active ? (
                            <>
                              <UserX className="mr-2 size-4"/>
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 size-4"/>
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 size-4"/>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
