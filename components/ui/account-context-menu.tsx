"use client"

import {BotAccountInterface} from "@/types";
import {useAccountActions} from "@/services/bot-account/use-account-actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import Link from "next/link";
import {routes} from "@/lib/routes";
import {
  ArrowLeftRight,
  BookUser,
  Earth,
  EarthLock,
  Heart,
  IdCard,
  MoreVertical,
  Pause,
  PencilLine,
  Play,
  RefreshCcwDot,
  ThumbsUp,
  Trash2,
} from "lucide-react";

interface AccountContextMenuProps {
  account: BotAccountInterface;
  trigger?: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function AccountContextMenu({
  account,
  trigger,
  align = "end",
  side = "bottom",
  className,
}: Readonly<AccountContextMenuProps>) {
  const {
    handleDelete,
    handleStart,
    handleStop,
    handleUpdateContent,
    handleUpdateToken,
    handleAddUsername,
    handleSetBio,
    isDeleting,
    isStarting,
    isStopping,
    isUpdatingContent,
    isUpdatingToken,
    isAddingUsername,
    isSettingBio,
  } = useAccountActions(account);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);
  const [isBioDialogOpen, setIsBioDialogOpen] = useState(false);
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [username, setUsername] = useState(account.username || "");
  const [bio, setBio] = useState(account.tinder_bio || "");

  const onDelete = async () => {
    await handleDelete();
    setIsDeleteDialogOpen(false);
  };

  const onAddUsername = async () => {
    await handleAddUsername(username);
    setIsUsernameDialogOpen(false);
  };

  const onSetBio = async () => {
    await handleSetBio(bio);
    setIsBioDialogOpen(false);
  };

  const onUpdateToken = async () => {
    await handleUpdateToken();
    setIsTokenDialogOpen(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger || (
            <Button variant="ghost" size="icon" className={className}>
              <MoreVertical className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} side={side} className="w-56">
          <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={account.status === "active" ? handleStop : handleStart}
            disabled={isStarting || isStopping}
          >
            {account.status === "active" ? (
              <>
                <Pause className="mr-2 size-4 text-red-500" />
                <span>Stop Account</span>
              </>
            ) : (
              <>
                <Play className="mr-2 size-4 text-green-700" />
                <span>Start Account</span>
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            {account.username ? (
              <Link
                href={`https://tinder.com/@${account.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Earth className="mr-2 size-4 text-purple-500" />
                <span>View on Tinder</span>
              </Link>
            ) : (
              <div className="flex cursor-not-allowed items-center opacity-50">
                <EarthLock className="mr-2 size-4" />
                <span>View on Tinder</span>
              </div>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleUpdateContent}
            disabled={isUpdatingContent}
          >
            <RefreshCcwDot className="mr-2 size-4 text-pink-500" />
            <span>Update Content</span>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={routes.dashboard.account.update(account.id)}
              className="flex items-center"
            >
              <PencilLine className="mr-2 size-4 text-blue-700" />
              <span>Edit Account</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsUsernameDialogOpen(true);
            }}
          >
            <IdCard className="mr-2 size-4 text-blue-500" />
            <span>Set Username</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsBioDialogOpen(true);
            }}
          >
            <BookUser className="mr-2 size-4 text-blue-500" />
            <span>Edit Bio</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsTokenDialogOpen(true);
            }}
          >
            <RefreshCcwDot className="mr-2 size-4 text-yellow-500" />
            <span>Update Token</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsDeleteDialogOpen(true);
            }}
            className="text-red-600"
          >
            <Trash2 className="mr-2 size-4" />
            <span>Delete Account</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            <div className="mb-1 flex items-center gap-1">
              <ArrowLeftRight className="size-3 text-blue-500" />
              <span>Swipes: {account.swipes || 0}</span>
            </div>
            <div className="mb-1 flex items-center gap-1">
              <ThumbsUp className="size-3 text-primary" />
              <span>Likes: {account.likes || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="size-3 text-rose-500" />
              <span>Matches: {account.matches || 0}</span>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Username Dialog */}
      <Dialog open={isUsernameDialogOpen} onOpenChange={setIsUsernameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Username</DialogTitle>
            <DialogDescription>
              Enter the Tinder username for this account.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="mt-2"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUsernameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={onAddUsername}
              disabled={isAddingUsername || !username.trim()}
            >
              {isAddingUsername ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bio Dialog */}
      <Dialog open={isBioDialogOpen} onOpenChange={setIsBioDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bio</DialogTitle>
            <DialogDescription>
              Update the Tinder bio for this account.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            className="mt-2"
            rows={5}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBioDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={onSetBio}
              disabled={isSettingBio}
            >
              {isSettingBio ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Token Update Dialog */}
      <Dialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Token</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the token for this account? This will refresh the authentication token used to connect to Tinder.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTokenDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={onUpdateToken}
              disabled={isUpdatingToken}
            >
              {isUpdatingToken ? "Updating..." : "Update Token"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
