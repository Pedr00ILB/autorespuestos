import React from 'react';
import { Badge } from "@/components/ui/badge";

interface MemoizedBadgeProps {
  isNew: boolean;
}

export const MemoizedBadge = React.memo(({ isNew }: MemoizedBadgeProps) => {
  return isNew ? (
    <Badge className="bg-green-600">Nuevo</Badge>
  ) : (
    <Badge variant="outline">Usado</Badge>
  );
});

MemoizedBadge.displayName = 'MemoizedBadge';
