"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

const fields = [
  ["income", "Revenus du foyer"],
  ["housing", "Logement"],
  ["bills", "Factures et assurances"],
  ["credits", "Crédits et dettes"],
  ["food", "Courses"],
  ["transport", "Transport"],
  ["other", "Autres dépenses"],
] as const;

type Field = (typeof fields)[number][0];

export default function BudgetCalculator() {
  const [values, setValues] = useState<Record<Field, string>>({ income: "", housing: "", bills: "", credits: "", food: "", transport: "", other: "" });
  const result = useMemo(() => {
    const amount = (key: Field) => Math.max(0, Number(values[key].replace(",", ".")) || 0);
    const expenses = fields.slice(1).reduce((sum, [key]) => sum + amount(key), 0);
    const balance = amount("income") - expenses;
    return { expenses, balance, weekly: Math.max(0, balance / 4.33) };
  }, [values]);

  return (
    <div className={styles.calculator}>
      <div className={styles.formGrid}>
        {fields.map(([key, label]) => (
          <label key={key}>{label}<span><input inputMode="decimal" value={values[key]} onChange={(event) => setValues({ ...values, [key]: event.target.value.replace(/[^0-9,.]/g, "") })} aria-label={`${label} en euros`} /><b>€</b></span></label>
        ))}
      </div>
      <div className={`${styles.result} ${result.balance < 0 ? styles.negative : ""}`} aria-live="polite">
        <div><span>Total des dépenses</span><strong>{result.expenses.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €</strong></div>
        <div><span>Reste à répartir ce mois</span><strong>{result.balance.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €</strong></div>
        {result.balance >= 0 && <p>Repère hebdomadaire maximum : <strong>{result.weekly.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €</strong>. Gardez une partie de cette somme pour les imprévus et l’épargne.</p>}
        {result.balance < 0 && <p>Le budget est déficitaire de <strong>{Math.abs(result.balance).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €</strong>. Passez directement à la rubrique « Si le compte est déjà dans le rouge » ci-dessous.</p>}
      </div>
      <p className={styles.privacy}>Calcul effectué uniquement dans votre navigateur : aucun montant n’est enregistré ni envoyé.</p>
    </div>
  );
}
