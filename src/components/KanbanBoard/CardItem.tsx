import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import type { CardType } from "./types";

interface Props {
    card: CardType;
    setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
}

const borderColors: any = {
    todo: "border-l-4 border-blue-500",
    inProgress: "border-l-4 border-orange-500",
    done: "border-l-4 border-green-500",
};

const CardItem: React.FC<Props> = ({ card, setCards }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: card.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(card.title);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete?")) {
            setCards((prev) =>
                prev.filter((c) => c.id !== card.id)
            );
        }
    };

    const handleSave = () => {
        if (value.trim() !== "") {
            setCards((prev) =>
                prev.map((c) =>
                    c.id === card.id ? { ...c, title: value } : c
                )
            );
        }
        setIsEditing(false);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white p-3 rounded shadow relative ${borderColors[card.columnId]}`}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
            >
                {isEditing ? (
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e) => e.key === "Enter" && handleSave()}
                        autoFocus
                        className="w-full border rounded px-2 py-1 text-sm"
                    />
                ) : (
                    <p
                        onDoubleClick={() => setIsEditing(true)}
                        className="text-sm text-gray-700"
                    >
                        {card.title}
                    </p>
                )}
            </div>

            <button
                onClick={handleDelete}
                className="mt-2 text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
            >
                <Trash2 size={14} />
                Delete
            </button>
        </div>
    );
};

export default CardItem;