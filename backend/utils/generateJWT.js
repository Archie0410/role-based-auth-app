import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Generate a secure random JWT secret
export const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Generate a JWT token for testing
export const generateTestToken = (userId, secret = null) => {
  const jwtSecret = secret || process.env.JWT_SECRET || 'devsecret';
  const payload = { id: userId };
  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
};

// CLI usage
const command = process.argv[2];

if (command === 'secret') {
  const secret = generateJWTSecret();
  console.log('\n🔐 Generated JWT Secret:');
  console.log(secret);
  console.log('\nAdd this to your .env file as:');
  console.log(`JWT_SECRET=${secret}\n`);
} else if (command === 'token' && process.argv[3]) {
  const userId = process.argv[3];
  const secret = process.argv[4] || process.env.JWT_SECRET || 'devsecret';
  const token = generateTestToken(userId, secret);
  console.log('\n🎫 Generated JWT Token:');
  console.log(token);
  console.log('\nUser ID:', userId);
  console.log('Expires in: 7 days\n');
} else if (process.argv.length > 2) {
  console.log('\nUsage:');
  console.log('  Generate JWT Secret:');
  console.log('    node utils/generateJWT.js secret');
  console.log('\n  Generate Test Token:');
  console.log('    node utils/generateJWT.js token <userId> [secret]\n');
}

