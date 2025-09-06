
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
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { deleteMultipleArticlesAction, updateMultipleArticlesAction } from "@/app/actions"
import type { Article, Category } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllCategories } from "@/lib/api";

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

const bulkEditSchema = z.object({
  status: z.enum(['Published', 'Draft', '__no_change__']).optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
});

type BulkEditFormValues = z.infer<typeof bulkEditSchema>;

const BulkEditDialog = ({
    selectedRows,
    onEdited,
    onCancel,
}: {
    selectedRows: Row<Article>[];
    onEdited: () => void;
    onCancel: () => void;
}) => {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = React.useState(false);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const articleIds = selectedRows.map(row => row.original.id);

    const form = useForm<BulkEditFormValues>({
        resolver: zodResolver(bulkEditSchema),
        defaultValues: {
            status: '__no_change__',
            category: '__no_change__',
            tags: '',
        }
    });

    React.useEffect(() => {
        getAllCategories().then(setCategories);
    }, []);

    const handleSave = async (data: BulkEditFormValues) => {
        const finalData = {
            status: data.status === '__no_change__' ? undefined : data.status,
            category: data.category === '__no_change__' ? undefined : data.category,
            tags: data.tags
        };
        
        if (!finalData.status && !finalData.category && !finalData.tags) {
            toast({ variant: 'destructive', title: 'কিছুই পরিবর্তন করা হয়নি', description: 'অনুগ্রহ করে কমপক্ষে একটি ফিল্ড পরিবর্তন করুন।' });
            return;
        }

        setIsSaving(true);
        const result = await updateMultipleArticlesAction(articleIds, finalData as any);
        if (result.success) {
            toast({ title: 'সফল', description: result.message });
            onEdited();
        } else {
            toast({ variant: 'destructive', title: 'ব্যর্থ', description: result.message });
        }
        setIsSaving(false);
    };

    return (
        <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>বাল্ক এডিট: {articleIds.length} টি আর্টিকেল</DialogTitle>
                    <DialogDescription>
                        নির্বাচিত আর্টিকেলগুলোর তথ্য একসাথে পরিবর্তন করুন। শুধুমাত্র যে ফিল্ডগুলো পূরণ করবেন সেগুলোই আপডেট হবে।
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleSave)} className="py-4 space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="status">স্ট্যাটাস</Label>
                        <Select onValueChange={(value) => form.setValue('status', value as any)} defaultValue="__no_change__">
                            <SelectTrigger id="status">
                                <SelectValue placeholder="স্ট্যাটাস পরিবর্তন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__no_change__">-- পরিবর্তন করবেন না --</SelectItem>
                                <SelectItem value="Published">Published</SelectItem>
                                <SelectItem value="Draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="category">ক্যাটাগরি</Label>
                        <Select onValueChange={(value) => form.setValue('category', value)} defaultValue="__no_change__">
                            <SelectTrigger id="category">
                                <SelectValue placeholder="ক্যাটাগরি পরিবর্তন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__no_change__">-- পরিবর্তন করবেন না --</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="tags">নতুন ট্যাগ যোগ করুন (কমা দিয়ে আলাদা করুন)</Label>
                        <Input id="tags" {...form.register('tags')} placeholder="যেমন: নতুন ট্যাগ, আরও একটি" />
                        <p className="text-xs text-muted-foreground">এই ট্যাগগুলো নির্বাচিত সব আর্টিকেলের বিদ্যমান ট্যাগের সাথে যোগ হবে।</p>
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="ghost" onClick={onCancel}>বাতিল করুন</Button>
                    <Button onClick={form.handleSubmit(handleSave)} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        সংরক্ষণ করুন
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
  const [isBulkEditOpen, setIsBulkEditOpen] = React.useState(false);
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
         {isBulkEditOpen && (
            <BulkEditDialog 
                selectedRows={table.getFilteredSelectedRowModel().rows as Row<Article>[]}
                onEdited={() => {
                    setIsBulkEditOpen(false);
                    table.resetRowSelection();
                }}
                onCancel={() => setIsBulkEditOpen(false)}
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
                     <Button variant="outline" size="sm" onClick={() => setIsBulkEditOpen(true)}>
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

    