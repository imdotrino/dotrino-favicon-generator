// Puente al registro de reputación (@dotrino/reputation). Lo consume el modal de
// perfil que abre el topbar; reusa el web-of-trust del vault para ponderar.
import { createVaultReputation } from '@dotrino/reputation'
import { getIdentity } from './identity'

let rep: ReturnType<typeof createVaultReputation> | null = null

/** Instancia compartida de reputación (o null si no hay vault). */
export async function getReputation () {
  if (rep) return rep
  const id = await getIdentity()
  if (!id) return null
  try { rep = createVaultReputation(id) } catch (_) { rep = null }
  return rep
}
