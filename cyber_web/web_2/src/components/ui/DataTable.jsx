import { cn } from '@/lib/cn'

export function DataTable({ columns, rows, empty = 'No records.', className }) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-line', className)}>
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="bg-raised/80 type-caption text-muted">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-3 py-3 font-medium">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-3 py-8 text-secondary" colSpan={columns.length}>
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-t border-line hover:bg-hover/50">
                {columns.map((column) => (
                  <td key={column.key} className="px-3 py-3 align-middle text-ink">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
