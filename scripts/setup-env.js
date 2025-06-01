import { writeFile, readFile, access, constants } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function fileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🚀 LearnTogether - Environment Setup\n');
  
  // Check if .env already exists
  const envPath = join(__dirname, '..', '.env');
  if (await fileExists(envPath)) {
    const overwrite = await question('.env file already exists. Do you want to overwrite it? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      process.exit(0);
    }
  }

  // Read .env.example
  const examplePath = join(__dirname, '..', '.env.example');
  let exampleContent;
  try {
    exampleContent = await readFile(examplePath, 'utf8');
  } catch (err) {
    console.error('❌ Error reading .env.example file:', err.message);
    process.exit(1);
  }

  // Extract variables
  const vars = [];
  const lines = exampleContent.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      vars.push(line);
      continue;
    }

    const [key] = trimmed.split('=');
    if (!key) continue;

    const value = await question(`Enter value for ${key} (${exampleContent.match(new RegExp(`${key}=(.*?)(\n|$)`))?.[1] || ''}): `);
    vars.push(`${key}=${value || ''}`);
  }

  // Write .env file
  try {
    await writeFile(envPath, vars.join('\n'));
    console.log('\n✅ Environment variables have been saved to .env');
    console.log('\n🎉 Setup complete! You can now start the development server with:');
    console.log('   npm run dev\n');
  } catch (err) {
    console.error('❌ Error writing .env file:', err.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
