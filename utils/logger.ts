import fs from 'fs';
import path from 'path';

class Logger {
  private baseLogDir: string;

  constructor() {
    this.baseLogDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(this.baseLogDir)) {
      fs.mkdirSync(this.baseLogDir);
    }
  }

  private getDailyLogFile(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // สร้างโฟลเดอร์ปีถ้ายังไม่มี
    const yearDir = path.join(this.baseLogDir, year.toString());
    if (!fs.existsSync(yearDir)) {
      fs.mkdirSync(yearDir);
    }

    // สร้างโฟลเดอร์เดือนถ้ายังไม่มี
    const monthDir = path.join(yearDir, month);
    if (!fs.existsSync(monthDir)) {
      fs.mkdirSync(monthDir);
    }
    
    // ชื่อไฟล์จะเป็น YYYY-MM-DD.log (เช่น 2024-02-05.log)
    return path.join(monthDir, `${year}-${month}-${day}.log`);
  }

  private formatThaiTime(): string {
    const date = new Date();
    // Add 7 hours for Thai timezone
    date.setHours(date.getHours() + 7);
    
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}|${hours}:${minutes}:${seconds}`;
  }

  private formatMessage(type: string, message: string, data?: any): string {
    const timestamp = this.formatThaiTime();
    let logMessage = `[${timestamp}] ${type}: ${message}`;
    
    if (data) {
      const dataString = Object.entries(data)
        .map(([key, value]) => `${key} : ${value}`)
        .join(' ');
      if (dataString) {
        logMessage += ` | ${dataString}`;
      }
    }
    
    return logMessage + '\n';
  }

  public info(message: string, data?: any) {
    const logMessage = this.formatMessage('INFO', message, data);
    fs.appendFileSync(this.getDailyLogFile(), logMessage);
  }

  public error(message: string, data?: any) {
    const logMessage = this.formatMessage('ERROR', message, data);
    fs.appendFileSync(this.getDailyLogFile(), logMessage);
  }

  public action(messageOrAction: string, usernameWithRole?: string) {
    const logMessage = this.formatMessage('ACTION', messageOrAction, 
      usernameWithRole ? { username: usernameWithRole } : undefined
    );
    fs.appendFileSync(this.getDailyLogFile(), logMessage);
  }

  public async getLogs(year: string, month: string, day?: string): Promise<string[]> {
    const yearDir = path.join(this.baseLogDir, year);
    if (!fs.existsSync(yearDir)) {
      return [`ไม่พบข้อมูล log สำหรับปี ${year}`];
    }

    const monthDir = path.join(yearDir, month);
    if (!fs.existsSync(monthDir)) {
      return [`ไม่พบข้อมูล log สำหรับเดือน ${month}/${year}`];
    }

    if (day) {
      const logFile = path.join(monthDir, `${year}-${month}-${day}.log`);
      if (!fs.existsSync(logFile)) {
        return [`ไม่พบข้อมูล log สำหรับวันที่ ${day}/${month}/${year}`];
      }
      const content = fs.readFileSync(logFile, 'utf-8');
      return content.split('\n').filter(line => line.trim());
    }

    return [`กรุณาระบุวันที่ต้องการดู log`];
  }
}

export const logger = new Logger();
