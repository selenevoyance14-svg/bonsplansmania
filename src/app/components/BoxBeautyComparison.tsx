import { Check, Minus, Sparkles } from "lucide-react";
import AffiliateButton from "./AffiliateButton";
import { BOX_BEAUTY_COMPARISON, type BoxBeautyComparisonItem } from "@/lib/box-beauty-comparison";

export function RecommendedOffer() {
  const choice = BOX_BEAUTY_COMPARISON[0];
  return (
    <aside className="box-recommended" aria-labelledby="box-recommended-title">
      <div>
        <span className="box-kicker"><Sparkles size={15} aria-hidden /> Notre choix n°1</span>
        <h2 id="box-recommended-title">{choice.name}</h2>
        <p>Une sélection naturelle ou bio, majoritairement française, avec des produits en format vente.</p>
        <strong>Avantage principal : des formats utilisables durablement, pas seulement des échantillons.</strong>
      </div>
      <AffiliateButton href={choice.affiliateUrl} merchant={choice.merchant} offerName={choice.offerName} position="hero">
        Voir l’offre Biotyfull Box
      </AffiliateButton>
    </aside>
  );
}

export function ComparisonTable() {
  return (
    <section className="box-comparison-block" aria-labelledby="box-comparison-title">
      <div className="box-section-heading">
        <h2 id="box-comparison-title">Comparatif rapide des box beauté</h2>
        <p>Prix et caractéristiques repris des données déjà présentes dans le comparatif.</p>
      </div>
      <div className="box-table-wrap">
        <table className="box-conversion-table">
          <thead><tr><th>Box</th><th>Prix</th><th>Engagement</th><th>Formats des produits</th><th>Idéale pour</th><th>Offre</th></tr></thead>
          <tbody>
            {BOX_BEAUTY_COMPARISON.map((box) => (
              <tr key={box.name}>
                <th scope="row">{box.name}</th>
                <td data-label="Prix">{box.price}</td>
                <td data-label="Engagement">{box.engagement}</td>
                <td data-label="Formats">{box.formats}</td>
                <td data-label="Idéale pour">{box.idealFor}</td>
                <td data-label="Offre">
                  <AffiliateButton href={box.affiliateUrl} merchant={box.merchant} offerName={box.offerName} position="tableau">
                    Voir l’offre
                  </AffiliateButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ProsAndCons({ box }: { box: BoxBeautyComparisonItem }) {
  return (
    <article className="box-profile-card">
      <h3>{box.name}</h3>
      <div className="box-pros-cons">
        <div><h4>Avantages</h4><ul>{box.advantages.map((item) => <li key={item}><Check size={15} aria-hidden />{item}</li>)}</ul></div>
        <div><h4>Inconvénients</h4><ul>{box.disadvantages.map((item) => <li key={item}><Minus size={15} aria-hidden />{item}</li>)}</ul></div>
      </div>
      <p><strong>Pour qui ?</strong> {box.profile}</p>
      <p className="box-card-verdict"><strong>Notre verdict :</strong> {box.verdict}</p>
      <AffiliateButton href={box.affiliateUrl} merchant={box.merchant} offerName={box.offerName} position="section">
        Voir l’offre {box.name}
      </AffiliateButton>
    </article>
  );
}

export function FinalVerdict() {
  const choices = [
    ["Petit budget", "Glowria avec engagement ou Blissim sans engagement"],
    ["Produits en format vente", "Biotyfull Box"],
    ["Beauté naturelle ou bio", "Belle au Naturel ou Biotyfull Box"],
    ["Découverte de marques", "Lookfantastic ou Glowria"],
    ["Abonnement flexible", "Blissim ou Belle au Naturel"],
  ];
  const choice = BOX_BEAUTY_COMPARISON[0];
  return (
    <section className="box-final-verdict" aria-labelledby="box-final-title">
      <h2 id="box-final-title">Verdict final : quelle box choisir selon votre profil ?</h2>
      <dl>{choices.map(([profile, result]) => <div key={profile}><dt>{profile}</dt><dd>{result}</dd></div>)}</dl>
      <AffiliateButton href={choice.affiliateUrl} merchant={choice.merchant} offerName={choice.offerName} position="verdict">
        Voir notre choix n°1
      </AffiliateButton>
    </section>
  );
}

export default function BoxBeautyComparison() {
  return (
    <div className="box-conversion-suite">
      <p className="box-verified-date">Comparatif mis à jour le 31 juillet 2026.</p>
      <RecommendedOffer />
      <ComparisonTable />
      <section aria-labelledby="box-details-title">
        <div className="box-section-heading"><h2 id="box-details-title">Avantages, limites et profils</h2></div>
        <div className="box-profile-grid">{BOX_BEAUTY_COMPARISON.map((box) => <ProsAndCons key={box.name} box={box} />)}</div>
      </section>
      <FinalVerdict />
      <style>{`
        .box-conversion-suite{margin:28px 0 44px}.box-verified-date{font-size:.82rem;color:#64748b;text-align:right}
        .box-recommended{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;padding:26px;border:2px solid #0ea5a9;border-radius:18px;background:linear-gradient(135deg,#ecfeff,#f0fdfa);margin:18px 0 32px}
        .box-recommended h2,.box-section-heading h2,.box-final-verdict h2{margin:8px 0}.box-recommended p{margin:8px 0}
        .box-kicker{display:inline-flex;align-items:center;gap:6px;color:#0f766e;font-weight:800;text-transform:uppercase;font-size:.76rem;letter-spacing:.06em}
        .box-affiliate-button{min-height:46px;display:inline-flex;align-items:center;justify-content:center;gap:7px;text-align:center;padding:11px 16px;white-space:normal}
        .box-section-heading{margin:30px 0 16px}.box-section-heading p{color:#64748b;margin:4px 0}
        .box-table-wrap{border:1px solid #dbe4e8;border-radius:16px;overflow:hidden;background:#fff}
        .box-conversion-table{width:100%;border-collapse:collapse;font-size:.86rem}.box-conversion-table th,.box-conversion-table td{padding:14px 10px;border-bottom:1px solid #e5e7eb;vertical-align:middle;text-align:left}
        .box-conversion-table thead{background:#0f766e;color:#fff}.box-conversion-table tbody tr:last-child th,.box-conversion-table tbody tr:last-child td{border-bottom:0}
        .box-conversion-table .box-affiliate-button{font-size:.78rem;width:100%}
        .box-profile-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
        .box-profile-card{border:1px solid #e2e8f0;border-radius:16px;padding:20px;background:#fff}.box-profile-card h3{margin:0 0 14px;color:#0f766e}
        .box-pros-cons{display:grid;grid-template-columns:1fr 1fr;gap:12px}.box-pros-cons h4{margin:0 0 8px;font-size:.9rem}.box-pros-cons ul{list-style:none;padding:0;margin:0}.box-pros-cons li{display:flex;gap:6px;align-items:flex-start;margin:6px 0;font-size:.86rem}
        .box-pros-cons li svg{flex:0 0 auto;margin-top:2px;color:#0f766e}.box-card-verdict{padding:10px 12px;background:#f8fafc;border-radius:10px}
        .box-profile-card .box-affiliate-button{width:100%}.box-final-verdict{margin-top:30px;padding:24px;border-radius:18px;background:#f8fafc;border:1px solid #cbd5e1}
        .box-final-verdict dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:18px 0}.box-final-verdict dl div{background:#fff;border-radius:10px;padding:12px}.box-final-verdict dt{font-weight:800;color:#0f766e}.box-final-verdict dd{margin:4px 0 0}
        @media(max-width:760px){
          .box-recommended{grid-template-columns:1fr;padding:20px}.box-recommended .box-affiliate-button{width:100%}
          .box-table-wrap{border:0;overflow:visible}.box-conversion-table,.box-conversion-table tbody{display:block}.box-conversion-table thead{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
          .box-conversion-table tr{display:grid;grid-template-columns:1fr;gap:0;border:1px solid #dbe4e8;border-radius:14px;margin-bottom:14px;overflow:hidden;background:#fff}
          .box-conversion-table th[scope=row]{display:block;background:#0f766e;color:#fff;font-size:1rem;padding:14px}.box-conversion-table td{display:grid;grid-template-columns:minmax(105px,38%) 1fr;gap:10px;border-bottom:1px solid #e5e7eb;padding:11px 14px}
          .box-conversion-table td::before{content:attr(data-label);font-weight:800;color:#334155}.box-conversion-table td:last-child{display:block;border-bottom:0}.box-conversion-table .box-affiliate-button{min-height:48px;font-size:.9rem}
          .box-profile-grid,.box-pros-cons,.box-final-verdict dl{grid-template-columns:1fr}.box-verified-date{text-align:left}
        }
      `}</style>
    </div>
  );
}
