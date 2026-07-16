// Identidad = vault id.dotrino.com (única fuente del ecosistema). No reimplementamos nada.
import { Identity } from '@dotrino/identity'

let identity: Identity | null = null

/** Instancia compartida de identidad (o null si el vault no responde). */
export async function getIdentity (): Promise<Identity | null> {
  if (identity) return identity
  try {
    identity = await Identity.connect()
  } catch (e) {
    console.warn('[identity] vault inalcanzable:', (e as Error)?.message)
    identity = null
  }
  return identity
}

export function myPubkey (): string | null { return identity?.me?.publickey || null }
export function myName (): string | null { return identity?.me?.nickname || null }
