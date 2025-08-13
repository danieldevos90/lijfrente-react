import LijfrenteForm from "../../../../components/LijfrenteForm";

export default function LijfrentePage({ params }: { params: { siteId: string } }) {
  return (
    <section>
      <LijfrenteForm siteId={params.siteId} />
    </section>
  );
}


