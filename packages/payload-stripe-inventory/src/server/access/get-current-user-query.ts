'use server'

import { headers as getHeaders } from 'next/headers.js'
import { BasePayload } from 'payload'
import { BaseUser } from '../../index.js'

export async function getCurrentUserQuery(payload: BasePayload): Promise<BaseUser | null> {
  const headers = await getHeaders()
  return (await payload.auth({ headers })).user as BaseUser | null
}
