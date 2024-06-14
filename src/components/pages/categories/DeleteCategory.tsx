import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MdDelete } from "react-icons/md";
import { ICategory, ICategoryType } from "@/models";
import { QueryDocumentSnapshot, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import Swal from "sweetalert2";
import { getError } from "@/utils";
import { deleteSubcategory } from "@/firebase/helpers";

export function DeleteCategory({
  category,
  categoryType,
}: {
  category: QueryDocumentSnapshot<ICategory>;
  categoryType: ICategoryType;
}) {
  const handleDelete = async () => {
    try {
      Swal.fire("S'il vous plaît, attendez...");
      Swal.showLoading(Swal.getConfirmButton());

      await deleteSubcategory(categoryType, category.id);

      const swalRes = await Swal.fire({
        title: "Succès!",
        // text: result.message ?? "You're logged in!",
        icon: "success",
        confirmButtonText: "Continuer",
      });

      // if (swalRes.value) {
      //   onSave();
      // }
    } catch (err) {
      Swal.fire({
        title: "Une erreur s'est produite!",
        html: getError("html", err),
        icon: "error",
        confirmButtonText: "Fermer",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive" className="cursor-pointer">
          <MdDelete className="h-5 w-5" />
          <span className="sr-only">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="text-2xl">Supprimer la catégorie</div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <p>Etes-vous sûr de vouloir supprimer cette catégorie?</p>
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="flex gap-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Annuler
              </Button>
            </DialogClose>

            <Button type="button" variant="destructive" onClick={handleDelete}>
              Continuer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
