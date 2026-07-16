(function () {

window.CA = window.CA || {}
window.CA.CHALLENGE_MANIFESTS = window.CA.CHALLENGE_MANIFESTS || []
window.CA.CHALLENGE_MANIFESTS.push({
  id: 'xss-reflection',
  title: 'Reflected XSS',
  domain: 'web',
  difficulty: 'beginner',
  description: 'A vulnerable search box reflects your input back to the page. Find a way to inject a script tag or an event handler.',
  xp: 150,
  objective: 'Inject a <script> tag or an onerror event handler into the reflection point.',
  hints: [
    'Try typing <script>alert(1)</script> in the input.',
    'Event handlers like <img src=x onerror=alert(1)> also execute JavaScript.',
    "The lab checks for <script> tags or any attribute starting with 'on' (onerror, onclick, etc.)."
  ],
  successCriteria: [
    'Payload contains a <script> tag, or',
    'Payload contains an HTML event handler such as onerror.'
  ]
})


})()
