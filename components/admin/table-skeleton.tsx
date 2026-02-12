import { TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns: number;
  columnConfig?: Array<{
    type: 'text' | 'image-text' | 'badge' | 'actions' | 'number' | 'rating' | 'price';
    width?: string;
  }>;
}

export const TableSkeleton = ({ 
  rows = 10, 
  columns,
  columnConfig 
}: TableSkeletonProps) => {
  
  const renderSkeletonCell = (columnIndex: number) => {
    const config = columnConfig?.[columnIndex];
    const type = config?.type || 'text';

    switch (type) {
      case 'image-text':
        return (
          <div className="flex items-center gap-3">
            <Skeleton className="h-14 w-14 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        );
      
      case 'badge':
        return <Skeleton className="h-6 w-20" />;
      
      case 'actions':
        return <Skeleton className="h-8 w-24" />;
      
      case 'number':
        return <Skeleton className="h-4 w-12" />;
      
      case 'rating':
        return <Skeleton className="h-4 w-16" />;
      
      case 'price':
        return (
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        );
      
      case 'text':
      default:
        return <Skeleton className={`h-4 ${config?.width || 'w-24'}`} />;
    }
  };

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={colIdx}>
              {renderSkeletonCell(colIdx)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
