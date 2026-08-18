const bedrock = require('bedrock-protocol');
const readline = require('readline');

const client = bedrock.createClient({
  host: 'donutsmp.net',
  port: 19132,
  profilesFolder: './auth_cache',
  offline: false
});

// Bot cuma login & stand-by setelah spawn
client.on('spawn', () => {
  console.log('✅ Bot sudah login & masuk ke server!');
  console.log('--- Bot siap menerima command manual dari console ---');
});

// Input manual via Terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  if (line.trim().length > 0) {
    const cmd = line.trim();
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
