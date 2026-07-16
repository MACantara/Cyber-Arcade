(function () {

const CHALLENGE_MANIFESTS = [
  {
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
  },
  {
    id: 'sqli-login',
    title: 'SQL Injection Login',
    domain: 'web',
    difficulty: 'beginner',
    description: "A vulnerable login form builds a SQL query by concatenating your username and password. Bypass authentication without the real password.",
    xp: 150,
    objective: "Bypass the login check using a SQL injection payload such as admin'-- or ' OR '1'='1.",
    hints: [
      "The query is: SELECT * FROM users WHERE username='YOUR_INPUT' AND password='YOUR_INPUT'.",
      "Try entering admin'-- in the username field to comment out the password check.",
      "Alternatively, make the WHERE clause always true with ' OR '1'='1."
    ],
    successCriteria: [
      'Username or password contains a SQL injection payload that comments out the password check, or',
      "Username or password makes the WHERE clause always true."
    ]
  },
  {
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
  },
  {
    id: 'port-knock',
    title: 'Port Knock',
    domain: 'network',
    difficulty: 'beginner',
    description: 'A server door is locked behind a series of closed ports. The admin left a note: "Start with SSH, then browse the web, then secure it, then try the dev server." Knock the ports in that order to open the door.',
    objective: 'Click the port buttons in the correct service order to unlock the server.',
    xp: 100,
    hints: [
      'Common port numbers: SSH = 22, HTTP = 80, HTTPS = 443, HTTP-alt = 8080.',
      'The admin note gives the order directly.'
    ],
    successCriteria: 'Knock the sequence 22, 80, 443, 8080 to open the door.'
  },
  {
    id: 'caesar-cipher',
    title: 'Caesar Cipher',
    domain: 'crypto',
    difficulty: 'beginner',
    description: 'A secret message was encrypted with a Caesar cipher. Use the known shift to decode it and recover the plaintext.',
    xp: 100,
    objective: 'Decode the encrypted message using the given rotation and enter the plaintext.',
    hints: [
      'Shift each letter back by 7 positions in the alphabet.',
      'Wrap around: A comes after T, U, V, etc.',
      'The decoded message is a short phrase about the arcade.'
    ],
    successCriteria: [
      'Enter the correct plaintext: RETRO ARCADE.'
    ]
  },
  {
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
      "Use the ASCII table: 41-5A are uppercase letters, 7B is '{' ."
    ],
    successCriteria: [
      'The decoded string is a flag in FLAG{...} format.'
    ]
  },
  {
    id: 'terminal-hunt',
    title: 'Terminal Hunt',
    domain: 'general',
    difficulty: 'beginner',
    description: 'Explore a fake Linux terminal. List files, read secrets, and grep logs to find the hidden flag.',
    xp: 100,
    prerequisites: [],
    objective: 'Use terminal commands to find the flag hidden in the filesystem.',
    hints: [
      "Try 'ls' to see the files in the current directory.",
      "Read secret.txt with 'cat', or search the logs with 'grep flag logs.txt'.",
      'Flags are wrapped in FLAG{...} .'
    ],
    successCriteria: [
      'User reveals the flag from the fake filesystem.'
    ]
  },
  {
    id: 'recon-robot',
    title: 'Recon Robot',
    domain: 'general',
    difficulty: 'beginner',
    description: 'Inspect a fake robots.txt file to find the disallowed path that contains the flag, then enter it.',
    xp: 100,
    prerequisites: [],
    objective: 'Inspect robots.txt and enter the flag hidden in a disallowed path.',
    hints: [
      "Look for lines that start with 'Disallow:' .",
      'One of the disallowed paths is the flag itself.',
      'Flags are wrapped in FLAG{...} .'
    ],
    successCriteria: [
      'User identifies and submits the flag from the disallowed path.'
    ]
  },
  {
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
  }
]

const DOMAINS = window.CA?.DOMAINS || []
const VALID_DIFFICULTIES = ['beginner', 'easy', 'medium', 'hard']
const VALID_DOMAINS = new Set(DOMAINS.map(d => d.id))

function validateManifest(manifest, index, domains, manifests) {
  const errors = []
  const required = ['id', 'title', 'domain', 'difficulty', 'description', 'xp', 'objective', 'hints', 'successCriteria']
  const knownDomains = domains
    ? new Set(Array.isArray(domains) ? domains : [...domains])
    : VALID_DOMAINS
  const allManifests = manifests || CHALLENGE_MANIFESTS

  for (const field of required) {
    if (manifest[field] == null) errors.push(`manifest[${index}].${field} is required`)
  }

  if (manifest.id && typeof manifest.id !== 'string') {
    errors.push(`manifest[${index}].id must be a string`)
  }

  if (manifest.title && typeof manifest.title !== 'string') {
    errors.push(`manifest[${index}].title must be a string`)
  }

  if (manifest.domain) {
    if (typeof manifest.domain !== 'string') {
      errors.push(`manifest[${index}].domain must be a string`)
    } else if (knownDomains.size > 0 && !knownDomains.has(manifest.domain)) {
      errors.push(`manifest[${index}].domain "${manifest.domain}" is not a known domain`)
    }
  }

  if (manifest.difficulty && !VALID_DIFFICULTIES.includes(manifest.difficulty)) {
    errors.push(`manifest[${index}].difficulty must be one of ${VALID_DIFFICULTIES.join(', ')}`)
  }

  if (typeof manifest.xp !== 'number' || manifest.xp < 0 || !Number.isFinite(manifest.xp)) {
    errors.push(`manifest[${index}].xp must be a non-negative finite number`)
  }

  if (manifest.hints && !Array.isArray(manifest.hints)) {
    errors.push(`manifest[${index}].hints must be an array`)
  }

  if (manifest.successCriteria != null && !Array.isArray(manifest.successCriteria) && typeof manifest.successCriteria !== 'string') {
    errors.push(`manifest[${index}].successCriteria must be an array or string`)
  }

  if (manifest.prerequisites != null && !Array.isArray(manifest.prerequisites)) {
    errors.push(`manifest[${index}].prerequisites must be an array`)
  }

  if (manifest.prerequisites) {
    for (const prereq of manifest.prerequisites) {
      if (typeof prereq !== 'string') {
        errors.push(`manifest[${index}].prerequisites must contain only strings`)
        break
      }
      if (!allManifests.some(c => c.id === prereq)) {
        errors.push(`manifest[${index}] references unknown prerequisite "${prereq}"`)
      }
    }
  }

  return errors
}

const validationErrors = CHALLENGE_MANIFESTS.flatMap((m, i) => validateManifest(m, i))
if (validationErrors.length) {
  console.error('Manifest validation errors:', validationErrors)
}

window.CA = window.CA || {}
window.CA.CHALLENGE_MANIFESTS = CHALLENGE_MANIFESTS
window.CA.validateManifest = validateManifest


})()
