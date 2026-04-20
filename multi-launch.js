const { spawn } = require('child_process');

const INSTANCES = 3;

console.log(`[0.1s] Launching ${INSTANCES} browser instances...`);

for (let i = 0; i < INSTANCES; i++) {
    const child = spawn('node', ['launch.js'], {
        stdio: 'inherit',
        env: { ...process.env, INSTANCE_ID: i.toString() }
    });
    
    child.on('error', (err) => {
        console.error(`Instance ${i} error:`, err);
    });
    
    setTimeout(() => {}, i * 5000);
}

console.log('[0.1s] All instances launched.');