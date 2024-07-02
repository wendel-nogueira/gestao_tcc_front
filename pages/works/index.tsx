import ListWorks from "@/components/modules/work/list/List";
import { Button } from "@/components/ui/button";
import { AuthServices } from "@/core/services/AuthServices";
import { WorkServices } from "@/core/services/WorkServices";
import { File } from "@phosphor-icons/react";
import { useState } from "react";

export default function Works() {
  const [loading, setLoading] = useState(false);

  const authService = AuthServices();
  const workService = WorkServices();

  const handleExport = async () => {
    const token = authService.getToken();

    if (!token) return;

    setLoading(true);

    const data = authService.parseJwt(token);
    const email = data.email;

    await workService
      .exportWorks(email)
      .then(() => {
        setLoading(false);
        alert("Exporting works...");
      })
      .catch(() => {
        alert("Failed to export works...");
        setLoading(false);
      });
  };

  return (
    <div className="p-6 space-y-1 mt-10">
      <Button variant="outline" onClick={handleExport} disabled={loading}>
        <File className="mr-2" size={16} />
        Export
      </Button>
      <ListWorks />
    </div>
  );
}
