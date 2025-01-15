// app/page.tsx
"use client";

import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FaStar, FaTrash } from "react-icons/fa";
import { Button } from "../components/Button";
import ActorRow from "../components/ActorRow";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface Actor {
  actor: string;
  role: string;
  cost: number;
}

interface Row {
  feature: string;
  description: string;
  criticite: number;
  statut: "Obligatoire" | "Optionnel";
  acteurs: Actor[];
  totalCost: number;
}

interface Category {
  title: string;
  rows: Row[];
}

export default function GestionDesFonctionnalitesPage() {
  const [data, setData] = useState<Category[]>([
    {
      title: "1. Gestion des Produits",
      rows: [
        {
          feature: "",
          description: "",
          criticite: 0,
          statut: "Obligatoire",
          acteurs: [{ actor: "Développeur", role: "Dev", cost: 0 }],
          totalCost: 0,
        },
      ],
    },
  ]);

  const addCategory = () => {
    setData((prev) => [
      ...prev,
      {
        title: "Nouvelle Catégorie",
        rows: [],
      },
    ]);
  };

  const deleteCategory = (catIndex: number) => {
    setData((prev) => {
      const newData = [...prev];
      newData.splice(catIndex, 1);
      return newData;
    });
  };

  const updateCategoryTitle = (catIndex: number, newTitle: string) => {
    setData((prev) => {
      const newData = [...prev];
      newData[catIndex].title = newTitle;
      return newData;
    });
  };

  const addRow = (catIndex: number) => {
    setData((prev) => {
      const newData = [...prev];
      newData[catIndex].rows.push({
        feature: "",
        description: "",
        criticite: 0,
        statut: "Obligatoire",
        acteurs: [],
        totalCost: 0,
      });
      return newData;
    });
  };

  const deleteRow = (catIndex: number, rowIndex: number) => {
    setData((prev) => {
      const newData = [...prev];
      newData[catIndex].rows.splice(rowIndex, 1);
      return newData;
    });
  };

  const updateRowValue = (
    catIndex: number,
    rowIndex: number,
    field: keyof Row,
    value: string | number | Actor[]
  ) => {
    setData((prev) => {
      const newData = [...prev];
      const row = newData[catIndex].rows[rowIndex];
      // @ts-ignore
      row[field] = value;
      return newData;
    });
  };

  const addActor = (catIndex: number, rowIndex: number) => {
    setData((prev) => {
      const newData = [...prev];
      newData[catIndex].rows[rowIndex].acteurs.push({
        actor: "",
        role: "Autre",
        cost: 0,
      });
      return newData;
    });
  };

  const updateActor = (
    catIndex: number,
    rowIndex: number,
    actorIndex: number,
    field: keyof Actor,
    value: string | number
  ) => {
    setData((prev) => {
      const newData = [...prev];
      const acteur = newData[catIndex].rows[rowIndex].acteurs[actorIndex];
      // @ts-ignore
      acteur[field] = value;
      return newData;
    });
    recalcTotal(catIndex, rowIndex);
  };

  const deleteActor = (
    catIndex: number,
    rowIndex: number,
    actorIndex: number
  ) => {
    setData((prev) => {
      const newData = [...prev];
      newData[catIndex].rows[rowIndex].acteurs.splice(actorIndex, 1);
      return newData;
    });
    recalcTotal(catIndex, rowIndex);
  };

  const recalcTotal = (catIndex: number, rowIndex: number) => {
    setData((prev) => {
      const newData = [...prev];
      const row = newData[catIndex].rows[rowIndex];
      const total = row.acteurs.reduce((sum, a) => sum + (a.cost || 0), 0);
      row.totalCost = total;
      return newData;
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const img = "/logo-techtrust-blue.png";
    doc.addImage(img, "PNG", 10, 10, 40, 20);
    let currentY = 40;

    data.forEach((cat) => {
      doc.setFont("courier", "normal");
      doc.text(cat.title, 10, currentY);
      currentY += 8;

      const rowsForPdf = cat.rows.map((row) => [
        row.feature,
        row.description,
        `${row.criticite} / 5`,
        row.statut,
        row.acteurs
          .map((actor) => `${actor.role}: (${actor.cost} €)`)
          .join("\n"),
        `${row.totalCost} €`,
      ]);

      doc.autoTable({
        startY: currentY,
        head: [
          [
            "Fonctionnalité",
            "Description",
            "Criticité",
            "Statut",
            "Acteurs",
            "Total Coût",
          ],
        ],
        body: rowsForPdf,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [15, 23, 42],
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 30 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25 },
          4: { cellWidth: 50 },
          5: { cellWidth: 30 },
        },
        theme: "grid",
      });

      currentY = doc.lastAutoTable.finalY + 10;
    });

    doc.save("Gestion_Fonctionnalites.pdf");
  };

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <Image
          src="/logo-techtrust-blue.png"
          alt="Logo"
          width={100}
          height={100}
          className="object-contain"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Gestion des Fonctionnalités
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          onClick={addCategory}
          variant="primary"
          size="default"
          className="text-sm px-3 py-2"
        >
          Ajouter une Catégorie
        </Button>
        <Button
          onClick={generatePDF}
          variant="secondary"
          size="default"
          className="text-sm px-3 py-2"
        >
          Générer le PDF
        </Button>
      </div>

      <AnimatePresence>
        {data.map((category, catIndex) => (
          <motion.div
            key={catIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mb-6 rounded-lg bg-white shadow-lg overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200 bg-primary text-primary-foreground">
              <input
                type="text"
                value={category.title}
                onChange={(e) => updateCategoryTitle(catIndex, e.target.value)}
                className="text-sm sm:text-base font-bold w-full bg-transparent border-none outline-none"
              />
              <Button
                onClick={() => deleteCategory(catIndex)}
                variant="destructive"
                size="sm"
                className="md:w-[20vw] mt-2 sm:mt-0 text-sm px-4 py-2 flex items-center justify-center"
              >
                <FaTrash className="mr-2" />
                Supprimer la categorie
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-2 py-2 text-left text-sm">
                      Fonctionnalité
                    </th>
                    <th className="px-2 py-2 text-left text-sm">Description</th>
                    <th className="px-2 py-2 text-left text-sm">Criticité</th>
                    <th className="px-2 py-2 text-left text-sm">Statut</th>
                    <th className="px-2 py-2 text-left text-sm">Acteurs</th>
                    <th className="px-2 py-2 text-left text-sm">Total Coût</th>
                    <th className="px-2 py-2 text-left text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {category.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b hover:bg-gray-50">
                      <td className="px-2 py-2 text-sm">
                        <textarea
                          className="w-full border border-gray-300 p-2 rounded resize-none text-sm"
                          value={row.feature}
                          onChange={(e) =>
                            updateRowValue(
                              catIndex,
                              rowIndex,
                              "feature",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="px-2 py-2 text-sm">
                        <textarea
                          className="w-full border border-gray-300 p-2 rounded resize-none text-sm"
                          value={row.description}
                          onChange={(e) =>
                            updateRowValue(
                              catIndex,
                              rowIndex,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="px-2 py-2 text-sm">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className="cursor-pointer"
                              color={star <= row.criticite ? "#FFC700" : "#ccc"}
                              onClick={() =>
                                updateRowValue(
                                  catIndex,
                                  rowIndex,
                                  "criticite",
                                  star
                                )
                              }
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-sm">
                        <select
                          className="w-full border border-gray-300 p-2 rounded text-sm"
                          value={row.statut}
                          onChange={(e) =>
                            updateRowValue(
                              catIndex,
                              rowIndex,
                              "statut",
                              e.target.value
                            )
                          }
                        >
                          <option value="Obligatoire">Obligatoire</option>
                          <option value="Optionnel">Optionnel</option>
                        </select>
                      </td>
                      <td className="px-2 py-2 text-sm">
                        {row.acteurs.map((actor, actorIndex) => (
                          <ActorRow
                            key={actorIndex}
                            actor={actor}
                            actorIndex={actorIndex}
                            catIndex={catIndex}
                            rowIndex={rowIndex}
                            updateActor={updateActor}
                            deleteActor={deleteActor}
                          />
                        ))}
                        <Button
                          onClick={() => addActor(catIndex, rowIndex)}
                          variant="accent"
                          size="sm"
                          className="mt-2"
                        >
                          + Ajouter Acteur
                        </Button>
                      </td>
                      <td className="px-2 py-2 text-sm font-semibold">
                        {row.totalCost} €
                      </td>
                      <td className="px-2 py-2 text-sm">
                        <Button
                          onClick={() => deleteRow(catIndex, rowIndex)}
                          variant="destructive"
                          size="sm"
                        >
                          <FaTrash className="mr-2" /> Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4">
              <Button
                onClick={() => addRow(catIndex)}
                variant="primary"
                size="default"
              >
                Ajouter une Ligne
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
