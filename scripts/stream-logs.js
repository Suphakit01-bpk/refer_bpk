//npm run logs:watch ดูวันปัจจุบัน
//npm run logs:watch -- 2024-02-05 กำหนดวันที่ดู

const fs = require('fs');
const path = require('path');

// เพิ่มฟังก์ชันสำหรับแปลงวันที่จาก parameter
function parseDate(dateStr) {
  if (!dateStr) return new Date();
  
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [_, year, month, day] = match;
    return new Date(year, month - 1, day);
  }
  return new Date();
}

function getLogFile(date) {
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

  if (!fs.existsSync(path.dirname(logPath))) {
    return null;
  }

  if (!fs.existsSync(logPath)) {
    return null;
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

async function watchLogs(targetDate) {
  const logFile = getLogFile(targetDate);
  if (!logFile) {
    console.error('\x1b[31m%s\x1b[0m', `❌ ไม่พบไฟล์ log สำหรับวันที่ ${targetDate.toISOString().split('T')[0]}`);
    return;
  }

  console.clear();
  console.log('\x1b[35m%s\x1b[0m', '🔍 เริ่มการติดตาม Logs...');
  console.log('\x1b[36m%s\x1b[0m', `📁 กำลังติดตามไฟล์: ${logFile}`);
  console.log('\x1b[33m%s\x1b[0m', '⌛ รอข้อมูลใหม่... (กด Ctrl+C เพื่อออก)\n');

  let currentSize = 0;

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

  // ถ้าเป็นวันในอดีต ไม่ต้อง watch file
  if (targetDate.toDateString() !== new Date().toDateString()) {
    console.log('\n\x1b[33m%s\x1b[0m', '📢 แสดงข้อมูล log ย้อนหลัง (ไม่มีการติดตามการเปลี่ยนแปลง)');
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
    const newLogFile = getLogFile(new Date());
    if (newLogFile !== logFile) {
      watcher.close();
      console.log('\n\x1b[35m%s\x1b[0m', '📅 เปลี่ยนวันใหม่ กำลังย้ายไปยังไฟล์ log ใหม่...\n');
      watchLogs(new Date());
    }
  }, 1000);
  


  process.on('SIGINT', () => {
    watcher.close();
    console.log('\n\x1b[35m%s\x1b[0m', '👋 ปิดการติดตาม Logs');
    process.exit(0);
  });
}



// รับ parameter วันที่จาก command line
const dateArg = process.argv[2]; // รูปแบบ YYYY-MM-DD
const targetDate = parseDate(dateArg);

// เริ่มการทำงาน
watchLogs(targetDate).catch(console.error);
