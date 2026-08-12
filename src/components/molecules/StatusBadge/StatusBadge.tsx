import { Badge } from "@/components/atoms";
import { getStatusLabel, getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge className={getStatusColor(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
}
