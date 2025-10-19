export default function TokenSelector({ selected, onChange, tokens }) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border rounded-md"
    >
      {tokens.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
