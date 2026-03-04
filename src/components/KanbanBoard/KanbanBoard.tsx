import { useState } from "react";
import {
    DndContext,
    type DragEndEvent,
    closestCorners,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";

import Column from "./Column";
import { initialCards } from "./mockData";
import type { CardType, ColumnId } from "./types";

const columns: ColumnId[] = ["todo", "inProgress", "done"];

const columnTitles: Record<ColumnId, string> = {
    todo: "Todo",
    inProgress: "In Progress",
    done: "Done",
};

const KanbanBoard = () => {
    const [cards, setCards] = useState<CardType[]>(initialCards);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) return;

        const activeCard = cards.find((c) => c.id === activeId);
        const overCard = cards.find((c) => c.id === overId);

        if (!activeCard) return;

        // SAME COLUMN REORDER
        if (overCard && activeCard.columnId === overCard.columnId) {
            const columnCards = cards.filter(
                (c) => c.columnId === activeCard.columnId
            );

            const oldIndex = columnCards.findIndex(
                (c) => c.id === activeId
            );
            const newIndex = columnCards.findIndex(
                (c) => c.id === overId
            );

            const reordered = arrayMove(columnCards, oldIndex, newIndex);

            const newCards = [
                ...cards.filter(
                    (c) => c.columnId !== activeCard.columnId
                ),
                ...reordered,
            ];

            setCards(newCards);
        }

        // CROSS COLUMN MOVE
        else {
            const newColumnId =
                columns.includes(overId as ColumnId)
                    ? (overId as ColumnId)
                    : overCard?.columnId;

            if (!newColumnId) return;

            setCards((prev) =>
                prev.map((card) =>
                    card.id === activeId
                        ? { ...card, columnId: newColumnId }
                        : card
                )
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <DndContext
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center lg:items-start">
                    {columns.map((columnId) => {
                        const columnCards = cards.filter(
                            (c) => c.columnId === columnId
                        );

                        return (
                            <SortableContext
                                key={columnId}
                                items={columnCards.map((c) => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <Column
                                    columnId={columnId}
                                    title={columnTitles[columnId]}
                                    cards={columnCards}
                                    setCards={setCards}
                                />
                            </SortableContext>
                        );
                    })}
                </div>
            </DndContext>
        </div>
    );
};

export default KanbanBoard;