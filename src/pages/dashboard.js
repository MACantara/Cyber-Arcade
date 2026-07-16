(function () {

(async function () {
  const { loadProfile, loadProgress, loadBadges, loadSettings, loadDaily } = window.CA.services.progress
  await Promise.all([loadProfile(), loadProgress(), loadBadges(), loadSettings()])
  await loadDaily(window.CA.registry.getAll())
})()


})()
