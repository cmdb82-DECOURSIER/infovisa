import { z } from 'zod'

export const VisaQuerySchema = z.object({
  from:     z.string().length(2).toUpperCase(),
  to:       z.string().length(2).toUpperCase(),
  visaType: z.enum(['Tourist', 'Business', 'Student', 'Residence', 'Transit']).optional().default('Tourist'),
  limit:    z.coerce.number().min(1).max(200).optional().default(100),
})

export const CountryQuerySchema = z.object({
  region: z.string().optional(),
  limit:  z.coerce.number().min(1).max(250).optional().default(200),
})

export const SearchQuerySchema = z.object({
  q:     z.string().min(1),
  limit: z.coerce.number().min(1).max(20).optional().default(10),
})

export const AlertSubscribeSchema = z.object({
  email:       z.string().email(),
  fromCountry: z.string().length(2).toUpperCase().optional(),
  toCountry:   z.string().length(2).toUpperCase().optional(),
  alertTypes:  z.array(z.enum(['policyChange', 'costChange', 'newRoute'])).min(1),
  frequency:   z.enum(['immediate', 'weekly', 'monthly']).optional().default('immediate'),
})
