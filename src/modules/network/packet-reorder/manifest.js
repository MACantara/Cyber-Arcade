(function () {

window.CA = window.CA || {}
window.CA.CHALLENGE_MANIFESTS = window.CA.CHALLENGE_MANIFESTS || []
window.CA.CHALLENGE_MANIFESTS.push({
  id: 'packet-reorder',
  title: 'Packet Reorder',
  domain: 'network',
  difficulty: 'beginner',
  description: 'A secret message was split into TCP packets and scrambled during capture. Click the packets in the correct sequence-number order to reassemble the flag.',
  objective: 'Reassemble the packets in ascending sequence order to reveal the message.',
  xp: 100,
  hints: [
    'Sequence numbers start at 1000 and increase by 20.',
    "The first packet payload starts with 'FLAG'."
  ],
  successCriteria: 'Reassemble all four packets to read the full flag.'
})


})()
