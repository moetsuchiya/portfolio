import { randomBytes, scryptSync } from 'node:crypto';
// Read from stdin, never from command-line arguments or shell history.
const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const password = Buffer.concat(chunks).toString('utf8').replace(/\r?\n$/, '');
if (password.length < 12 || password.length > 256) {
  console.error('パスワードは12〜256文字にしてください。'); process.exit(1);
}
const salt = randomBytes(16).toString('hex');
console.log(`scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`);
