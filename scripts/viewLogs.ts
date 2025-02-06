import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const baseLogDir = path.join(process.cwd(), 'logs');

function showHelp() {
  console.log(`
วิธีใช้งาน:
  npm run logs -- [options]

Options:
  --year YYYY       ดู log ทั้งปี (เช่น --year 2024)
  --month MM        ดู log เฉพาะเดือน (เช่น --month 01)
  --type TYPE       กรองประเภท log (INFO, ERROR, ACTION)
  --search TEXT     ค้นหาข้อความใน log
  --tail N         แสดง N บรรทัดล่าสุด (default: แสดงทั้งหมด)
  --help           แสดงวิธีใช้งาน

ตัวอย่าง:
  npm run logs -- --year 2024 --month 01
  npm run logs -- --year 2024 --type ERROR
  npm run logs -- --search "เข้าสู่ระบบ"
  npm run logs -- --tail 50
`);
}

function readLogs(year: string, month?: string, options: any = {}) {
  try {
    const yearDir = path.join(baseLogDir, year);
    if (!fs.existsSync(yearDir)) {
      console.error(`❌ ไม่พบข้อมูล log ปี ${year}`);
      return;
    }

    const logFile = month 
      ? path.join(yearDir, `${year}-${month}.log`)
      : path.join(yearDir, `${year}.log`);

    if (!fs.existsSync(logFile)) {
      console.error('❌ ไม่พบไฟล์ log');
      return;
    }

    let logs = fs.readFileSync(logFile, 'utf-8').split('\n');

    // กรองตามประเภท
    if (options.type) {
      logs = logs.filter(log => log.includes(`${options.type}:`));
    }

    // ค้นหาข้อความ
    if (options.search) {
      logs = logs.filter(log => log.toLowerCase().includes(options.search.toLowerCase()));
    }

    // แสดง N บรรทัดล่าสุด
    if (options.tail) {
      logs = logs.slice(-options.tail);
    }

    if (logs.length === 0) {
      console.log('ไม่พบข้อมูล log ตามเงื่อนไขที่ระบุ');
      return;
    }

    console.log('\n=== แสดงข้อมูล Log ===');
    console.log(`📅 ปี: ${year}${month ? ` เดือน: ${month}` : ''}`);
    if (options.type) console.log(`🏷️  ประเภท: ${options.type}`);
    if (options.search) console.log(`🔍 ค้นหา: ${options.search}`);
    console.log('========================\n');

    logs.forEach(log => {
      if (log.trim()) {
        console.log(log);
      }
    });

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการอ่านไฟล์ log:', error);
  }
}

// แปลง arguments เป็น options
if (args.includes('--help')) {
  showHelp();
} else {
  const options: any = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    options[key] = value;
  }

  if (!options.year) {
    options.year = new Date().getFullYear().toString();
  }

  readLogs(options.year, options.month, {
    type: options.type,
    search: options.search,
    tail: options.tail ? parseInt(options.tail) : undefined
  });
}
