import { getApplication } from '@/lib/adminQueries'
import { renderApplicationPdf } from '@/lib/pdf/renderApplicationPdf'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const app = await getApplication(id)
  if (!app) return new Response('not found', { status: 404 })
  const pdf = await renderApplicationPdf(app)
  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="basvuru-${app.applicationNo}.pdf"`,
    },
  })
}
