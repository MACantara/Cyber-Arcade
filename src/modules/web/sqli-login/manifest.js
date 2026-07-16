export default {
  id: 'sqli-login',
  title: 'SQL Injection Login',
  domain: 'web',
  difficulty: 'beginner',
  description: 'A vulnerable login form builds a SQL query by concatenating your username and password. Bypass authentication without the real password.',
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
}
