import { z } from 'zod'

export const businessTypes = ['GERCEK_KISI','SAHIS_ISLETMESI','SIRKET','KOOPERATIF','DERNEK','KAMU_KURUMU','DIGER'] as const

// Zod 4 syntax: `z.email()` (not `z.string().email()`), and `{ error }` for custom
// messages (the v3 `errorMap`/`required_error` options were removed).
export const applicationInputSchema = z.object({
  applicantName: z.string().trim().min(2, 'Adı Soyadı / Firma Unvanı zorunludur').max(200),
  idOrTaxNo: z.string().trim().regex(/^\d{10,11}$/, 'T.C. Kimlik No (11) veya Vergi No (10) giriniz'),
  activitySubject: z.string().trim().min(2, 'Faaliyet konusu zorunludur').max(300),
  businessType: z.enum(businessTypes),
  businessTypeOther: z.string().trim().max(120).optional(),
  contactPerson: z.string().trim().min(2, 'Yetkili kişi zorunludur').max(150),
  phone: z.string().trim().regex(/^[0-9 ()+]{7,20}$/, 'Geçerli bir telefon giriniz'),
  email: z.string().trim().pipe(z.email('Geçerli bir e-posta giriniz').max(200)),
  address: z.string().trim().min(5, 'Adres zorunludur').max(400),
  products: z.string().trim().min(2, 'Ürün bilgisi zorunludur').max(2000),
  needsElectricity: z.boolean(),
  otherRequests: z.string().trim().max(2000).optional(),
  declarationAccepted: z.literal(true, { error: 'Beyan ve taahhüt zorunludur' }),
  kvkkAccepted: z.literal(true, { error: 'KVKK onayı zorunludur' }),
  turnstileToken: z.string().min(1, 'Doğrulama gerekli'),
}).refine(
  (d) => d.businessType !== 'DIGER' || (d.businessTypeOther && d.businessTypeOther.length > 0),
  { path: ['businessTypeOther'], error: 'Diğer için açıklama giriniz' },
)

export type ApplicationInput = z.infer<typeof applicationInputSchema>
