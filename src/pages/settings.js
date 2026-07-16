(function () {

(async function () {
  const { loadProfile, loadProgress, loadBadges, loadSettings } = window.CA.services.progress
  await Promise.all([loadProfile(), loadProgress(), loadBadges(), loadSettings()])
})()


})()
