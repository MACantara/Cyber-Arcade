(function () {

const all = window.CA && window.CA.CHALLENGE_MANIFESTS ? window.CA.CHALLENGE_MANIFESTS : []
const byId = new Map(all.map(c => [c.id, c]))

window.CA = window.CA || {}
window.CA.registry = {
  getAll: () => all,
  getById: (id) => byId.get(id),
  byDomain: (domain) => all.filter(c => c.domain === domain)
}


})()
