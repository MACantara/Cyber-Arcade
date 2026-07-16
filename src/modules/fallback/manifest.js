(function () {

window.CA = window.CA || {}
window.CA.CHALLENGE_MANIFESTS = window.CA.CHALLENGE_MANIFESTS || []
window.CA.CHALLENGE_MANIFESTS.push({
  id: 'welcome',
  title: 'Welcome to the Arcade',
  domain: 'general',
  difficulty: 'beginner',
  description: 'Get comfortable with the terminal. Find the hidden flag and earn your first XP.',
  xp: 100,
  objective: 'Type the flag from the terminal output.',
  hints: [
    'Read the terminal output carefully.',
    'The flag is hidden in the boot log.',
    'Type FLAG{...} exactly as shown.'
  ],
  successCriteria: [
    'User enters the correct flag.'
  ]
})


})()
