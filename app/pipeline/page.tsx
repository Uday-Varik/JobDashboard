"use client";

import { useState } from "react";
import { KanbanBoard } from "@/components/pipeline/kanban-board";
import { ApplicationForm } from "@/components/applications/application-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useApplications } from "@/hooks/use-applications";
import { Plus } from "lucide-react";
import type { ApplicationStage } from "@/lib/types";

export default function PipelinePage() {
  const { applications, loading, createApplication, updateStage } = useApplications();
  const [open, setOpen] = useState(false);

  const handleCreate = async (values: Parameters<typeof createApplication>[0]) => {
    await createApplication(values);
    setOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Pipeline</h1>
          <p className="text-sm text-gray-500 mt-0.5">Drag cards between stages to update status</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Application
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">Loading pipeline...</div>
      ) : (
        <KanbanBoard applications={applications} onStageChange={updateStage} />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Application</DialogTitle>
          </DialogHeader>
          <ApplicationForm onSubmit={handleCreate} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
