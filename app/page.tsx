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
  // Données initiales
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

  // === Fonctions de mise à jour de la data ===

  // Ajouter une nouvelle catégorie
  const addCategory = () => {
    setData((prev) => [
      ...prev,
      {
        title: "Nouvelle Catégorie",
        rows: [],
      },
    ]);
  };

  // Supprimer une catégorie
  const deleteCategory = (catIndex: number) => {
    setData((prev) => {
      const newData = [...prev];
      newData.splice(catIndex, 1);
      return newData;
    });
  };

  // Mettre à jour le titre d’une catégorie
  const updateCategoryTitle = (catIndex: number, newTitle: string) => {
    setData((prev) => {
      const newData = [...prev];
      newData[catIndex].title = newTitle;
      return newData;
    });
  };

  // Ajouter une ligne (row) dans une catégorie
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

  // Supprimer une ligne (row)
  const deleteRow = (catIndex: number, rowIndex: number) => {
    setData((prev) => {
      const newData = [...prev];
      newData[catIndex].rows.splice(rowIndex, 1);
      return newData;
    });
  };

  // Mettre à jour une cellule (feature, description, etc.)
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

  // Ajouter un acteur à une ligne
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

  // Mettre à jour un acteur
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

  // Supprimer un acteur
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

  // Recalculer le total d’une ligne
  const recalcTotal = (catIndex: number, rowIndex: number) => {
    setData((prev) => {
      const newData = [...prev];
      const row = newData[catIndex].rows[rowIndex];
      const total = row.acteurs.reduce((sum, a) => sum + (a.cost || 0), 0);
      row.totalCost = total;
      return newData;
    });
  };

  // === Génération PDF ===
  const generatePDF = () => {
    const doc = new jsPDF();

    // Charger le logo
    const img = "/logo-techtrust-blue.png"; // Assurez-vous que le logo est accessible dans public
    doc.addImage(img, "PNG", 10, 10, 40, 20); // Position x, y, largeur, hauteur
    let currentY = 40; // Position initiale après le logo

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

      // Configuration du tableau avec gestion du texte long
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
          overflow: "linebreak", // Gère les retours à la ligne
        },
        headStyles: {
          fillColor: [15, 23, 42], // Navy pour l'entête
        },
        columnStyles: {
          0: { cellWidth: 30 }, // Largeur de la colonne "Fonctionnalité"
          1: { cellWidth: 30 }, // Largeur de la colonne "Description"
          2: { cellWidth: 20 }, // Largeur de la colonne "Criticité"
          3: { cellWidth: 25 }, // Largeur de la colonne "Statut"
          4: { cellWidth: 50 }, // Largeur de la colonne "Acteurs"
          5: { cellWidth: 30 }, // Largeur de la colonne "Total Coût"
        },
        theme: "grid",
      });

      // Mise à jour Y pour la prochaine catégorie
      currentY = doc.lastAutoTable.finalY + 10;
    });

    doc.save("Gestion_Fonctionnalites.pdf");
  };

  // === Rendu JSX ===
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-10">
        <Image
          src="/logo-techtrust-blue.png" // Chemin vers le logo
          alt="Logo"
          width={100}
          height={100}
          className="mr-4" // Ajoute une marge droite
        />
      </div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Gestion des Fonctionnalités
      </h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <Button
          onClick={addCategory}
          variant="primary"
          size="default"
          // On peut custom className si besoin
        >
          Ajouter une Catégorie
        </Button>
        <Button
          onClick={generatePDF}
          variant="secondary"
          size="default"
          className="bg-secondary text-secondary-foreground"
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
            className="mb-8 rounded-lg bg-white shadow"
          >
            {/* Header de catégorie */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 rounded-t-lg bg-primary text-primary-foreground">
              <input
                type="text"
                value={category.title}
                onChange={(e) => updateCategoryTitle(catIndex, e.target.value)}
                className="font-bold text-xl w-full mr-4 bg-transparent border-none outline-none"
              />
              <Button
                onClick={() => deleteCategory(catIndex)}
                variant="destructive"
                size="sm"
                className="w-[20vw]"
              >
                <FaTrash className="mr-2" />
                Supprimer Catégorie
              </Button>
            </div>

            {/* Tableau */}
            <div className="overflow-x-auto p-4">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-4 py-2">Fonctionnalité</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Criticité</th>
                    <th className="px-4 py-2">Statut</th>
                    <th className="px-4 py-2">Acteurs</th>
                    <th className="px-4 py-2">Total Coût</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {category.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b last:border-none hover:bg-gray-50"
                    >
                      {/* Feature */}
                      <td className="px-4 py-3 align-top">
                        <textarea
                          className="w-full border border-gray-200 p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                          value={row.feature}
                          onChange={(e) =>
                            updateRowValue(
                              catIndex,
                              rowIndex,
                              "feature",
                              e.target.value
                            )
                          }
                          rows={2}
                        />
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3 align-top">
                        <textarea
                          className="w-full border border-gray-200 p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                          value={row.description}
                          onChange={(e) =>
                            updateRowValue(
                              catIndex,
                              rowIndex,
                              "description",
                              e.target.value
                            )
                          }
                          rows={2}
                        />
                      </td>

                      {/* Criticité (rating) */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center gap-1">
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

                      {/* Statut (select) */}
                      <td className="px-4 py-3 align-top">
                        <select
                          className="w-full border border-gray-200 w-[9vw] p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
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

                      {/* Acteurs */}
                      <td className="px-4 py-3 align-top">
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

                      {/* Total Cost */}
                      <td className="px-4 py-3 align-top font-semibold">
                        {row.totalCost} €
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 align-top">
                        <Button
                          onClick={() => deleteRow(catIndex, rowIndex)}
                          variant="destructive"
                          size="sm"
                        >
                          <FaTrash className="mr-2" />
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 pb-4">
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
