const bedrock = require('bedrock-protocol');

const TARGET_PLAYER = '.Harizmaulana'; 
let tpaInterval = null;
let isTeleported = false;
let lastPos = null;

const client = bedrock.createClient({
  host: 'donutsmp.net',
  port: 19132,
  profilesFolder: './auth_cache',
  offline: false
});

function sendCommand(cmd) {
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

// 1. Saat bot baru masuk ke server
client.on('spawn', () => {
  console.log('✅ Bot sudah spawn, mulai spam TPA...');
  isTeleported = false;

  // Spam TPA setiap 10 detik
  tpaInterval = setInterval(() => {
    if (!isTeleported) {
      sendCommand(`/tpa ${TARGET_PLAYER}`);
    }
  }, 10000);
});

// 2. Deteksi Perpindahan (Teleportasi)
client.on('move_player', (packet) => {
  const currentPos = packet.position;

  if (lastPos && !isTeleported) {
    const dx = Math.abs(currentPos.x - lastPos.x);
    const dz = Math.abs(currentPos.z - lastPos.z);

    // Kalau bot pindah tiba-tiba > 10 block, berarti TPA sukses
    if (dx > 10 || dz > 10) {
      console.log('🎉 Teleport terdeteksi! Menghentikan TPA.');
      isTeleported = true;
      clearInterval(tpaInterval);

      // Tunggu 3 detik biar game stabil dulu
      setTimeout(() => {
        sendCommand('/sethome 1');
        console.log('📌 Posisi baru sudah di-sethome!');
      }, 3000);
    }
  }
  lastPos = currentPos;
});

// 3. Deteksi Respawn (Bot mati lalu hidup lagi)
client.on('respawn', () => {
  console.log('💀 Bot mati/respawn! Menuju ke Home...');
  
  // Tunggu 5 detik agar bot benar-benar bisa gerak/command
  setTimeout(() => {
    sendCommand('/home 1');
  }, 5000);
});

client.on('disconnect', (packet) => console.log('❌ Disconnect:', packet.reason));
client.on('error', (err) => console.log('⚠️ Error:', err.message));
