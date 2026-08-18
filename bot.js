const bedrock = require('bedrock-protocol');
const readline = require('readline');

const client = bedrock.createClient({
  host: 'donutsmp.net',
  port: 19132,
  profilesFolder: './auth_cache',
  offline: false
});

// Bot login & standby
client.on('spawn', () => {
  console.log('✅ Bot berhasil masuk ke server DonutSMP!');
  console.log('--- Siap menerima perintah manual dari Console ---');
});

// Fitur ngetik manual lewat Console / Terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  const cmd = line.trim();
  if (cmd.length > 0) {
    client.queue('text', {
      type: 'chat',
      needs_translation: false,
      source_name: client.username,
      xuid: '',
      platform_chat_id: '',
      message: cmd
    });
    console.log(`[Sent]: ${cmd}`);
  }
});

client.on('disconnect', (packet) => console.log('❌ Disconnect:', packet.reason));
client.on('error', (err) => console.log('⚠️ Error:', err.message));
