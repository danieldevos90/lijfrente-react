import LeadForm from "../../../../components/LeadForm";

export default function SiteLeadPage({ params }: { params: { siteId: string } }) {
  return (
    <section>
      <h1>Vraag je aanbod aan</h1>
      <LeadForm siteId={params.siteId} />
    </section>
  );
}


