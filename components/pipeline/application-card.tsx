"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Building2, DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Application } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

const priorityDot: Record<string, string> = {
  high: "bg-red-400",
  medium: "bg-amber-400",
  low: "bg-gray-300",
};

interface Props {
  application: Application;
}

export function ApplicationCard({ application }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-white border border-gray-200 rounded-lg p-3 cursor-grab active:cursor-grabbing",
        "hover:border-gray-300 hover:shadow-sm transition-all",
        isDragging && "opacity-50 shadow-lg rotate-1"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", priorityDot[application.priority])} />
          <span className="text-xs font-medium text-gray-900 truncate">
            {application.company?.name ?? "Unknown"}
          </span>
        </div>
        <Link
          href={`/applications/${application.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <p className="text-xs text-gray-600 mb-2 truncate">{application.role_title}</p>

      <div className="flex items-center justify-between text-xs text-gray-400">
        {application.salary_min ? (
          <span className="flex items-center gap-0.5">
            <DollarSign className="w-3 h-3" />
            {Math.round(application.salary_min / 1000)}k
            {application.salary_max && `–${Math.round(application.salary_max / 1000)}k`}
          </span>
        ) : (
          <span />
        )}
        <span>
          {application.applied_date
            ? formatDistanceToNow(new Date(application.applied_date), { addSuffix: true })
            : formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
        </span>
      </div>

      {(application.contacts?.length ?? 0) > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1">
          <Building2 className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400">
            {application.contacts!.length} contact{application.contacts!.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
