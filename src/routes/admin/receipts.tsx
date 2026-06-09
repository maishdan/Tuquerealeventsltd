import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/receipts')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/receipts"!</div>
}
