
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Edit, Trash2, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { deleteMultipleArticlesAction } from "@/app/actions"
import type { Article } from "@/lib/types"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const DeleteBulkConfirmationDialog = ({ 
    selectedRows, 
    onDeleted, 
    onCancel 
}: { 
    selectedRows: Row<Article>[], 
    onDeleted: () => void, 
    onCancel: () => void 
}) => {
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = React.useState(false);
    const articleIds = selectedRows.map(row => row.original.id);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteMultipleArticlesAction(articleIds);
        if (result.success) {
            toast({ title: "সফল", description: result.message });
            onDeleted();
        } else {
            toast({ variant: "destructive", title: "ব্যর্থ", description: result.message });
        }
        setIsDeleting(false);
    };

    return (
        <AlertDialog open={true} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                    <AlertDialogDescription>
                        এই কাজটি আনডু করা যাবে না। এটি স্থায়ীভাবে {articleIds.length} টি আর্টিকেল ডিলিট করে দেবে।
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>বাতিল করুন</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        ডিলিট করুন
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};


export function DataTable<TData extends Article, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const { toast } = useToast()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
        pagination: {
            pageSize: 20,
        }
    }
  })

  const numSelected = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="w-full">
         {isDeleteConfirmOpen && (
            <DeleteBulkConfirmationDialog 
                selectedRows={table.getFilteredSelectedRowModel().rows as Row<Article>[]}
                onDeleted={() => {
                    setIsDeleteConfirmOpen(false);
                    table.resetRowSelection();
                }}
                onCancel={() => setIsDeleteConfirmOpen(false)}
            />
        )}
        <div className="flex items-center py-4">
            <Input
            placeholder="শিরোনাম দিয়ে ফিল্টার করুন..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
             {numSelected > 0 && (
                <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm text-muted-foreground">{numSelected} টি নির্বাচিত</span>
                     <Button variant="outline" size="sm" onClick={() => toast({ title: "আসন্ন ফিচার", description: "বাল্ক এডিটর শীঘ্রই আসছে।" })}>
                        <Edit className="mr-2 h-4 w-4" /> এডিট
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setIsDeleteConfirmOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" /> ডিলিট
                    </Button>
                </div>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                    কলাম <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                        const columnIdMap: { [key: string]: string } = {
                            'title': 'শিরোনাম',
                            'status': 'স্ট্যাটাস',
                            'category': 'ক্যাটাগরি',
                            'authorName': 'লেখক',
                            'tags': 'ট্যাগ',
                            'publishedAt': 'প্রকাশের তারিখ',
                        };
                        return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                            }
                        >
                            {columnIdMap[column.id] || column.id}
                        </DropdownMenuCheckboxItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="rounded-md border">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            পূর্ববর্তী
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            পরবর্তী
            </Button>
      </div>
    </div>
  )
}
