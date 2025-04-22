"use client"

import { useState, useEffect, useMemo } from "react"
import { Edit, MoreHorizontal, RefreshCw, Trash, XCircle, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useSubscriptions } from "@/services/subscriptions/hooks"
import { SubscriptionInterface } from "@/types"

export function SubscriptionsList() {
  const { data: fetchedSubscriptions = [], isLoading, isError } = useSubscriptions();
  const [subscriptions, setSubscriptions] = useState<SubscriptionInterface[]>([]);
  const [filterValue, setFilterValue] = useState("");

  // Update subscriptions state when fetchedSubscriptions changes
  useEffect(() => {
    if (fetchedSubscriptions && fetchedSubscriptions.length > 0) {
      setSubscriptions(fetchedSubscriptions);
    }
  }, [fetchedSubscriptions]);

  // Filter subscriptions based on filterValue
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((subscription) => {
      const searchTerm = filterValue.toLowerCase();
      const userName = `${subscription.user.first_name} ${subscription.user.last_name}`.toLowerCase();
      const userEmail = subscription.user.email.toLowerCase();
      const planName = typeof subscription.plan === 'object' && subscription.plan ? 
        subscription.plan.name.toLowerCase() : 
        '';
      
      return (
        userName.includes(searchTerm) ||
        userEmail.includes(searchTerm) ||
        planName.includes(searchTerm) ||
        subscription.status.toLowerCase().includes(searchTerm)
      );
    });
  }, [subscriptions, filterValue]);

  const renewSubscription = (subscriptionId: string) => {
    setSubscriptions(
      subscriptions.map((subscription) => {
        if (subscription.id === subscriptionId) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setFullYear(endDate.getFullYear() + 1);

          return {
            ...subscription,
            status: "active",
            start_date: startDate,
            end_date: endDate,
          };
        }
        return subscription;
      }),
    );
  };

  const cancelSubscription = (subscriptionId: string) => {
    setSubscriptions(
      subscriptions.map((subscription) =>
        subscription.id === subscriptionId ? { ...subscription, status: "cancelled" } : subscription,
      ),
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge>Active</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div>Loading subscriptions...</div>;
  }

  if (isError) {
    return <div>Error loading subscriptions. Please try again later.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Subscriptions</CardTitle>
        <CardDescription>A list of all user subscriptions in your application</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search subscriptions..."
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
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No subscriptions found.
                </TableCell>
              </TableRow>
            ) : filteredSubscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage 
                        src={subscription.user.profile_picture?.link || "/placeholder.svg"} 
                        alt={`${subscription.user.first_name} ${subscription.user.last_name}`} 
                      />
                      <AvatarFallback>
                        {subscription.user.first_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {subscription.user.first_name} {subscription.user.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {subscription.user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {typeof subscription.plan === 'object' && subscription.plan 
                    ? subscription.plan.name 
                    : 'Unknown Plan'}
                </TableCell>
                <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(subscription.start_date)} - {formatDate(subscription.end_date)}
                  </div>
                </TableCell>
                <TableCell>
                  ${typeof subscription.plan === 'object' && subscription.plan 
                    ? subscription.plan.price 
                    : 0}/mo
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => renewSubscription(subscription.id)}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Renew
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => cancelSubscription(subscription.id)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
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
  );
}