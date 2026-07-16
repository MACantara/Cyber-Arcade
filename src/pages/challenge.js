(function () {

document.addEventListener('DOMContentLoaded', async () => {
  const { loadProfile, loadProgress, loadBadges, loadSettings, loadDaily } = window.CA.services.progress
  await Promise.all([loadProfile(), loadProgress(), loadBadges(), loadSettings()])
  await loadDaily(window.CA.registry.getAll())

  const id = new URLSearchParams(location.search).get('id')
  const main = document.querySelector('main')
  if (!id || !main) return

  const el = document.createElement('x-challenge')
  el.setAttribute('challenge-id', id)
  main.appendChild(el)
})


})()
