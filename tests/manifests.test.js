global.window = { CA: {} }

require('../src/modules/domains.js')
require('../src/modules/manifests.js')

const { CHALLENGE_MANIFESTS, DOMAINS, validateManifest } = global.window.CA
const domainIds = (DOMAINS || []).map(d => d.id)
const errors = CHALLENGE_MANIFESTS.flatMap((m, i) => validateManifest(m, i, domainIds))

if (errors.length) {
  console.error('Manifest validation failed:')
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`All ${CHALLENGE_MANIFESTS.length} challenge manifests are valid.`)
