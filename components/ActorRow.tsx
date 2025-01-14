// components/ActorRow.tsx
"use client";

import React from "react";
import { FaTrash } from "react-icons/fa";
import { Button } from "../components/Button";

interface Actor {
  actor: string;
  role: string;
  cost: number;
}

interface ActorRowProps {
  actor: {
    actor: string;
    role: string;
    cost: number;
  };
  actorIndex: number;
  catIndex: number;
  rowIndex: number;
  updateActor: (
    catIndex: number,
    rowIndex: number,
    actorIndex: number,
    field: keyof Actor,
    value: string | number
  ) => void;
  deleteActor: (catIndex: number, rowIndex: number, actorIndex: number) => void;
}

const ActorRow: React.FC<ActorRowProps> = ({
  actor,
  actorIndex,
  catIndex,
  rowIndex,
  updateActor,
  deleteActor,
}) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <select
        className="border border-gray-300 dark:border-gray-600 p-1 rounded dark:bg-gray-600 dark:text-white"
        value={actor.role}
        onChange={(e) =>
          updateActor(catIndex, rowIndex, actorIndex, "role", e.target.value)
        }
      >
        <option value="Dev">Dev</option>
        <option value="Design">Design</option>
        <option value="Autre">Autre</option>
      </select>

      <input
        type="number"
        className="border border-gray-300 dark:border-gray-600 p-1 rounded w-20 dark:bg-gray-600 dark:text-white"
        value={actor.cost}
        onChange={(e) =>
          updateActor(
            catIndex,
            rowIndex,
            actorIndex,
            "cost",
            parseFloat(e.target.value || "0")
          )
        }
      />

      <Button
        onClick={() => deleteActor(catIndex, rowIndex, actorIndex)}
        variant="destructive"
        size="sm"
        className="flex items-center"
      >
        <FaTrash />
      </Button>
    </div>
  );
};

export default ActorRow;
