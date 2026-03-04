export type ColumnId = "todo" | "inProgress" | "done";

export interface CardType {
    id: string;
    title: string;
    columnId: ColumnId;
}

export interface ColumnType {
    id: ColumnId;
    title: string;
}