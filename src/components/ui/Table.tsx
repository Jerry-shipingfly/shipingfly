import React from 'react';
import { Loader2, Inbox } from 'lucide-react';
import { cn } from '@/utils/helpers';

/**
 * Table column configuration
 */
export interface TableColumn<T> {
  /** Column title */
  title: React.ReactNode;
  /** Data field key */
  dataIndex?: keyof T;
  /** Column width */
  width?: string | number;
  /** Alignment */
  align?: 'left' | 'center' | 'right';
  /** Fixed column */
  fixed?: 'left' | 'right';
  /** Custom render function */
  render?: (value: T[keyof T] | undefined, record: T, index: number) => React.ReactNode;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  /** Current page number */
  current: number;
  /** Items per page */
  pageSize: number;
  /** Total count */
  total: number;
  /** Page change callback */
  onChange?: (page: number, pageSize: number) => void;
}

/**
 * Table component Props interface
 */
export interface TableProps<T> {
  /** Data source */
  dataSource: T[];
  /** Column configuration */
  columns: TableColumn<T>[];
  /** Row unique key field */
  rowKey?: keyof T | ((record: T) => string);
  /** Loading state */
  loading?: boolean;
  /** Empty data text */
  emptyText?: string;
  /** Empty data icon */
  emptyIcon?: React.ReactNode;
  /** Pagination configuration */
  pagination?: PaginationConfig | false;
  /** Whether to show border */
  bordered?: boolean;
  /** Whether to show striped rows */
  striped?: boolean;
  /** Whether hoverable highlight */
  hoverable?: boolean;
  /** Row class name */
  rowClassName?: string | ((record: T, index: number) => string);
  /** Row click event */
  onRowClick?: (record: T, index: number) => void;
  /** Extended class name */
  className?: string;
  /** Header class name */
  headerClassName?: string;
  /** Table size */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Size style mapping
 */
const sizeStyles: Record<'sm' | 'md' | 'lg', { cell: string; header: string }> = {
  sm: { cell: 'px-3 py-2 text-sm', header: 'px-3 py-2 text-sm' },
  md: { cell: 'px-4 py-3 text-sm', header: 'px-4 py-3 text-sm' },
  lg: { cell: 'px-6 py-4 text-base', header: 'px-6 py-4 text-base' },
};

/**
 * Alignment style mapping
 */
const alignStyles: Record<'left' | 'center' | 'right', string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * Common table component
 * @description Supports data source configuration, column configuration, loading state, empty state, pagination, etc.
 *
 * @example
 * const columns = [
 *   { title: 'Name', dataIndex: 'name' },
 *   { title: 'Age', dataIndex: 'age', align: 'center' },
 * ];
 *
 * <Table
 *   dataSource={users}
 *   columns={columns}
 *   rowKey="id"
 *   loading={isLoading}
 * />
 */
export function Table<T>({
  dataSource,
  columns,
  rowKey = 'id' as keyof T,
  loading = false,
  emptyText = 'No data',
  emptyIcon,
  pagination,
  bordered = false,
  striped = false,
  hoverable = true,
  rowClassName,
  onRowClick,
  className,
  headerClassName,
  size = 'md',
}: TableProps<T>): React.ReactElement {
  // Get row unique key
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    const key = record[rowKey];
    return key !== undefined ? String(key) : String(index);
  };

  // Get cell value
  const getCellValue = (record: T, column: TableColumn<T>, index: number): React.ReactNode => {
    if (column.render) {
      const value = column.dataIndex ? record[column.dataIndex] : undefined;
      return column.render(value, record, index);
    }
    if (column.dataIndex) {
      return record[column.dataIndex] as React.ReactNode;
    }
    return null;
  };

  // Render pagination
  const renderPagination = () => {
    if (!pagination || typeof pagination === 'boolean') return null;

    const { current, pageSize, total, onChange } = pagination;
    const totalPages = Math.ceil(total / pageSize);

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Total {total} records
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={current <= 1}
            onClick={() => onChange?.(current - 1, pageSize)}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            {current} / {totalPages}
          </span>
          <button
            type="button"
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={current >= totalPages}
            onClick={() => onChange?.(current + 1, pageSize)}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg',
        bordered && 'border border-gray-200',
        className
      )}
    >
      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          {/* Table header */}
          <thead>
            <tr
              className={cn(
                'bg-gray-50 border-b border-gray-200',
                headerClassName
              )}
            >
              {columns.map((column, index) => (
                <th
                  key={column.dataIndex?.toString() || index}
                  className={cn(
                    sizeStyles[size].header,
                    'font-semibold text-gray-700',
                    alignStyles[column.align || 'left'],
                    column.fixed === 'left' && 'sticky left-0 bg-gray-50',
                    column.fixed === 'right' && 'sticky right-0 bg-gray-50'
                  )}
                  style={{
                    width: column.width,
                    minWidth: column.width,
                  }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table body */}
          <tbody className="bg-white">
            {!loading && dataSource.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12">
                  <div className="flex flex-col items-center justify-center">
                    {emptyIcon || <Inbox className="w-12 h-12 text-gray-300 mb-4" />}
                    <p className="text-gray-500">{emptyText}</p>
                  </div>
                </td>
              </tr>
            ) : (
              dataSource.map((record, rowIndex) => {
                const customRowClass =
                  typeof rowClassName === 'function'
                    ? rowClassName(record, rowIndex)
                    : rowClassName;

                return (
                  <tr
                    key={getRowKey(record, rowIndex)}
                    className={cn(
                      'border-b border-gray-100',
                      striped && rowIndex % 2 === 1 && 'bg-gray-50',
                      hoverable && 'hover:bg-gray-50',
                      onRowClick && 'cursor-pointer',
                      customRowClass
                    )}
                    onClick={() => onRowClick?.(record, rowIndex)}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={column.dataIndex?.toString() || colIndex}
                        className={cn(
                          sizeStyles[size].cell,
                          'text-gray-600',
                          alignStyles[column.align || 'left'],
                          column.fixed === 'left' && 'sticky left-0 bg-inherit',
                          column.fixed === 'right' && 'sticky right-0 bg-inherit'
                        )}
                      >
                        {getCellValue(record, column, rowIndex)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}

export default Table;
