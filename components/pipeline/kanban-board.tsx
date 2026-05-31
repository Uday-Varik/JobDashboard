"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApplicationCard } from "./application-card";
import { STAGES, ACTIVE_STAGES } from "@/lib/types";
import type { Application, ApplicationStage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useDndDroppable } from "./use-droppable";

function KanbanColumn({
  stageId,
  label,
  color,
  applications,
}: {
  stageId: ApplicationStage;
  label: string;
  color: string;
  applications: Application[];
}) {
  const { setNodeRef, isOver } = useDndDroppable(stageId);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-shrink-0 w-60 flex flex-col rounded-xl border",
        isOver ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"
      )}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded border", color)}>
            {label}
          </span>
        </div>
        <span className="text-xs text-gray-400 font-medium">{applications.length}</span>
      </div>
      <ScrollArea className="flex-1 max-h-[calc(100vh-200px)]">
        <SortableContext
          items={applications.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="p-2 space-y-2 min-h-16">
            {applications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        </SortableContext>
      </ScrollArea>
    </div>
  );
}

interface Props {
  applications: Application[];
  onStageChange: (id: string, stage: ApplicationStage) => void;
}

export function KanbanBoard({ applications, onStageChange }: Props) {
  const [activeApp, setActiveApp] = useState<Application | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveApp(null);
    if (!over) return;

    const appId = active.id as string;
    const overId = over.id as string;

    // over can be a column (stage id) or a card (app uuid) — resolve to a stage either way
    let newStage: ApplicationStage | undefined;
    if (STAGES.some((s) => s.id === overId)) {
      newStage = overId as ApplicationStage;
    } else {
      newStage = applications.find((a) => a.id === overId)?.stage;
    }

    if (newStage && newStage !== applications.find((a) => a.id === appId)?.stage) {
      onStageChange(appId, newStage);
    }
  };

  const visibleStages = STAGES.filter((s) => ACTIVE_STAGES.includes(s.id));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(e) => {
        const app = applications.find((a) => a.id === e.active.id);
        if (app) setActiveApp(app);
      }}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {visibleStages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stageId={stage.id}
            label={stage.label}
            color={stage.color}
            applications={applications.filter((a) => a.stage === stage.id)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeApp && <ApplicationCard application={activeApp} />}
      </DragOverlay>
    </DndContext>
  );
}
