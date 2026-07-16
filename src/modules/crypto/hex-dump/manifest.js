(function () {

window.CA = window.CA || {}
window.CA.CHALLENGE_MANIFESTS = window.CA.CHALLENGE_MANIFESTS || []
window.CA.CHALLENGE_MANIFESTS.push({
  id: 'hex-dump',
  title: 'Hex Dump',
  domain: 'crypto',
  difficulty: 'beginner',
  description: 'A hidden message was captured as raw hex bytes. Decode the hex to ASCII to reveal the flag.',
  xp: 100,
  objective: 'Convert the hex dump into ASCII and enter the decoded string.',
  hints: [
    'Each pair like 46 is the ASCII code for one letter.',
    '46 4C 41 47 spells out the start of a flag.',
    "Use the ASCII table: 41-5A are uppercase letters, 7B is '{'."
  ],
  successCriteria: [
    'The decoded string is a flag in FLAG{...} format.'
  ]
})


})()
