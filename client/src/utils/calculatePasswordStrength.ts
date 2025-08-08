export  const passwordRules = [
{
 id: "length",
 label: "At least 8 characters",
 test: (pw: string) => pw.length >= 8,
},
{
 id: "uppercase",
 label: "One uppercase letter (A-Z)",
 test: (pw: string) => /[A-Z]/.test(pw),
},
{
 id: "lowercase",
 label: "One lowercase letter (a-z)",
 test: (pw: string) => /[a-z]/.test(pw),
},
{
 id: "number",
 label: "One number (0-9)",
 test: (pw: string) => /[0-9]/.test(pw),
},
{
 id: "special",
 label: "One special character (!@#$%^&*)",
 test: (pw: string) => /[!@#$%^&*]/.test(pw),
},
];

export const calculatePasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 3) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[\W_]/.test(password)) score++;
  return score; // 0-4
}
