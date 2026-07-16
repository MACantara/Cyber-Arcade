import { web } from './web/index.js'
import { network } from './network/index.js'
import { crypto } from './crypto/index.js'
import { general } from './general/index.js'
import fallbackManifest from './fallback/manifest.js'

const all = [...web, ...network, ...crypto, ...general, fallbackManifest]
const byId = new Map(all.map(c => [c.id, c]))

export const registry = {
  getAll: () => all,
  getById: (id) => byId.get(id),
  byDomain: (domain) => all.filter(c => c.domain === domain)
}
