//npm run logs:watch

const fs = require('fs');
const path = require('path');

function getTodayLogFile() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  const logPath = path.join(
    process.cwd(),
    'logs',
    year.toString(),
    month,
    `${year}-${month}-${day}.log`
  );

  // สร้างโฟลเดอร์ถ้ายังไม่มี
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  
  // สร้างไฟล์ถ้ายังไม่มี
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, '');
  }

  return logPath;
}

function colorLog(line) {
  if (!line.trim()) return '';
  
  if (line.includes('ERROR:')) {
    return `\x1b[31m${line}\x1b[0m`; // แดง
  } else if (line.includes('INFO:')) {
    return `\x1b[36m${line}\x1b[0m`; // ฟ้า
  } else if (line.includes('ACTION:')) {
    return `\x1b[32m${line}\x1b[0m`; // เขียว
  }
  return line;
}

async function watchLogs() {
  const logFile = getTodayLogFile();
  console.clear();
  console.log('\x1b[35m%s\x1b[0m', '🔍 เริ่มการติดตาม Logs...');
  console.log('\x1b[36m%s\x1b[0m', `📁 กำลังติดตามไฟล์: ${logFile}`);
  console.log('\x1b[33m%s\x1b[0m', '⌛ รอข้อมูลใหม่... (กด Ctrl+C เพื่อออก)\n');

  let currentSize = 0;

  // อ่านและแสดง logs ที่มีอยู่
  try {
    const content = fs.readFileSync(logFile, 'utf8');
    content.split('\n').forEach(line => {
      if (line.trim()) console.log(colorLog(line));
    });
    currentSize = fs.statSync(logFile).size;
  } catch (error) {
    console.error('ไม่สามารถอ่านไฟล์ log ได้:', error);
    return;
  }

  // ติดตามการเปลี่ยนแปลงของไฟล์
  const watcher = fs.watch(logFile, (eventType) => {
    if (eventType === 'change') {
      try {
        const stats = fs.statSync(logFile);
        if (stats.size > currentSize) {
          const buffer = Buffer.alloc(stats.size - currentSize);
          const fd = fs.openSync(logFile, 'r');
          fs.readSync(fd, buffer, 0, buffer.length, currentSize);
          fs.closeSync(fd);

          const newContent = buffer.toString();
          newContent.split('\n').forEach(line => {
            if (line.trim()) {
              console.log(colorLog(line));
            }
          });
          
          currentSize = stats.size;
        }
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error('เกิดข้อผิดพลาดในการอ่านข้อมูลใหม่:', error);
        }
      }
    }
  });

  // ตรวจสอบการเปลี่ยนวัน
  setInterval(() => {
    const newLogFile = getTodayLogFile();
    if (newLogFile !== logFile) {
      watcher.close();
      console.log('\n\x1b[35m%s\x1b[0m', '📅 เปลี่ยนวันใหม่ กำลังย้ายไปยังไฟล์ log ใหม่...\n');
      watchLogs();
    }
  }, 1000);

  process.on('SIGINT', () => {
    watcher.close();
    console.log('\n\x1b[35m%s\x1b[0m', '👋 ปิดการติดตาม Logs');
    process.exit(0);
  });
}

// เริ่มการทำงาน
watchLogs().catch(console.error);
