import { Address } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MapPin, Phone, Trash2, Edit, Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
  isDeleting?: boolean;
}

export const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting = false,
}: AddressCardProps) => {
  const getAddressTypeBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "home":
        return "default";
      case "work":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className={`relative flex flex-col ${address.isDefault ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-2">
            <Badge variant={getAddressTypeBadgeVariant(address.addressType)}>
              {address.addressType}
            </Badge>
            {address.isDefault && (
              <Badge variant="default" className="bg-green-600">
                <Check className="h-3 w-3 mr-1" />
                Default
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
          <div className="text-sm">
            <p className="font-medium">{address.streetAddress}</p>
            <p className="text-muted-foreground">
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p className="text-muted-foreground">{address.country}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-3 border-t mt-auto border-b">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(address)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>

        {!address.isDefault && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onSetDefault(address.id)}
          >
            <Check className="h-4 w-4 mr-1" />
            Set Default
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Address?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this address? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(address.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
