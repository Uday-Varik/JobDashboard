"use client";

import { useDroppable } from "@dnd-kit/core";

export function useDndDroppable(id: string) {
  return useDroppable({ id });
}
