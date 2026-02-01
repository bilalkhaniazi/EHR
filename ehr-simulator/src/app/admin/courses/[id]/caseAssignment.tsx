import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

export const title = "Invite Team Members";

const CaseAssignment = () => {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-700 hover:bg-blue-800 gap-2 shadow">
          <Plus />
          Assign Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite team members</DialogTitle>
          <DialogDescription>
            Invite your team members to collaborate on this project.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Select>

          </Select>
          <div className="space-y-2">
            <Label htmlFor="email2">Email address</Label>
            <Input id="email2" placeholder="teammate@example.com" type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email3">Email address</Label>
            <Input id="email3" placeholder="partner@example.com" type="email" />
          </div>
          <Button className="w-full">Send Invitations</Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or share link
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              className="flex-1"
              readOnly
              value="https://example.com/invite/abc123"
            />
            <Button size="sm" variant="outline">
              Copy
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Anyone with this link can join your team
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
};

export default CaseAssignment;
