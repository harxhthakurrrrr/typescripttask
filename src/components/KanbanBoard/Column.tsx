import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import CardItem from "./CardItem";
import type { CardType, ColumnId } from "./types";

interface Props {
    columnId: ColumnId;
    title: string;
    cards: CardType[];
    setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
}

const headerColors = {
    todo: "bg-blue-500",
    inProgress: "bg-orange-500",
    done: "bg-green-500",
};

const Column: React.FC<Props> = ({
    columnId,
    title,
    cards,
    setCards,
}) => {
    const { setNodeRef } = useDroppable({ id: columnId });

    const handleAddCard = () => {
        const title = prompt("Enter card title");
        if (!title) return;

        setCards((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                title,
                columnId,
            },
        ]);
    };

    return (
        <div
            ref={setNodeRef}
            className="w-80 bg-gray-200 rounded-lg shadow"
        >
            <div
                className={`p-3 text-white font-semibold flex justify-between rounded-t-lg ${headerColors[columnId]}`}
            >
                {title}
                <span className="bg-white text-gray-700 text-xs px-2 py-1 rounded">
                    {cards.length}
                </span>
            </div>
            <button
                onClick={handleAddCard}
                className="m-3 flex items-center gap-2 bg-white border px-3 py-1 rounded text-sm hover:bg-gray-50"
            >
                <Plus size={16} />
                Add Card
            </button>

            <div className="p-3 space-y-3 min-h-[350px]">
                {cards.map((card) => (
                    <CardItem
                        key={card.id}
                        card={card}
                        setCards={setCards}
                    />
                ))}
            </div>


        </div>
    );
};

export default Column;