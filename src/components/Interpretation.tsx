import texts from "../data/interpretations.cs.json";
export function Interpretation({ id }: { id: string }) {
  const text = (texts as Record<string, (typeof texts)["life:1"]>)[id];
  if (!text) return null;
  return (
    <div className="interpretation">
      <h3>{text.title}</h3>
      <p>{text.short}</p>
      <p>{text.long}</p>
      <div className="practice">
        <strong>Podnět k praxi</strong>
        <p>{text.activity}</p>
      </div>
      <p>
        <strong>Potenciál:</strong> {text.potential}
      </p>
      <small>
        Původ: vlastní redakční syntéza ({text.evidenceLevel}) ·{" "}
        {text.sourceRefs.join(", ")}
      </small>
    </div>
  );
}
