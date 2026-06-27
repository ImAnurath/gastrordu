import { renderToBuffer } from '@react-pdf/renderer'
import type { Application } from '@prisma/client'
import { ApplicationPdf } from './ApplicationPdf'

export async function renderApplicationPdf(app: Application): Promise<Buffer> {
  return renderToBuffer(ApplicationPdf({ app }))
}
