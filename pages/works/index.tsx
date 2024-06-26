import ListWorks from "@/components/modules/work/list/List";
import { Button } from "@/components/ui/button";
import { File } from "@phosphor-icons/react";

export default function Works() {
  return (
    <div className="p-6 space-y-1 mt-10">
      <Button variant="outline">
        <File className="mr-2" size={16} />
        Export
      </Button>
      <ListWorks />
    </div>
  );
}
