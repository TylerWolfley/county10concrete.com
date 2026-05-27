import { JsonLd } from "./JsonLd";

export function LegacyMain({ html, jsonLd }: { html: string; jsonLd: string[] }) {
  return (
    <>
      {jsonLd.map((json, index) => (
        <JsonLd key={index} json={json} />
      ))}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
