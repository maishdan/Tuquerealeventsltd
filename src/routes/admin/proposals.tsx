import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/proposals")({
  component: ProposalPage,
});

function ProposalPage() {
  return (
    <div className="p-8 text-white font-sans text-xl font-bold bg-[#03070d] min-h-[50vh] flex items-center justify-center border border-[#243343] rounded-xl">
      Hello Proposal
    </div>
  );
}
