import { Webhook } from "lucide-react";
import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="p-4 flex justify-between items-center">
      <Webhook className="h-4 w-4" />

      <div className="flex items-center space-x-4">
        {/* <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select realm" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="realm1">Realm 1</SelectItem>
        <SelectItem value="realm2">Realm 2</SelectItem>
      </SelectContent>
    </Select> */}
        {/* <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="@user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu> */}
      </div>
    </header>
  );
};
