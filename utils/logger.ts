import fs from 'fs';
import path from 'path';

interface LogMetadata {
  ip_address?: string;
  status_code?: number;
  user_agent?: string;
  [key: string]: any;
}

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
    
    const yearDir = path.join(this.baseLogDir, year.toString());
    const monthDir = path.join(yearDir, month);
    
    // Create directories if they don't exist
    if (!fs.existsSync(yearDir)) fs.mkdirSync(yearDir);
    if (!fs.existsSync(monthDir)) fs.mkdirSync(monthDir);
    
    const fileName = `${year}-${month}-${day}.log`;
    const logPath = path.join(monthDir, fileName);
    
    // Validate file extension
    if (fs.existsSync(logPath) && !fileName.endsWith('.log')) {
      throw new Error('Invalid log file format - must be .log extension');
    }
    
    return logPath;
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

  private detectBrowser(userAgent: string): string {
    // ต้องเช็ค Edge ก่อน Chrome เพราะ Edge มี Chrome ใน user agent string
    if (userAgent.includes('Edg/')) return 'Edge';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari/') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('OPR/') || userAgent.includes('Opera')) return 'Opera';
    
    // Extract browser name from complex user agent string
    const browserMatch = userAgent.match(/(\w+)\/[\d.]+/);
    if (browserMatch) return browserMatch[1];
    
    return 'Other';
  }

  private formatIpAddress(ip: string): string {
    // Remove IPv6 prefix if present
    if (ip.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }
    
    // Split IP into parts
    const parts = ip.split('.');
    if (parts.length === 4) {
      // Format IPv4 address
      return parts.map(part => part.padStart(3, ' ')).join('.');
    }
    
    return ip; // Return original if not IPv4
  }

  private formatMessage(type: string, message: string, data?: LogMetadata): string {
    const timestamp = this.formatThaiTime();
    let logMessage = `[${timestamp}] ${type}: ${message}`;
    
    if (data) {
      const formattedData = { ...data };
      
      // Format IP address if present
      if (formattedData.ip_address) {
        formattedData.ip_address = this.formatIpAddress(formattedData.ip_address);
      }

      // Show browser info only for INFO and ACTION types
      if (formattedData.user_agent && (type === 'INFO')) {
        formattedData.browser = this.detectBrowser(formattedData.user_agent);
        delete formattedData.user_agent; // Remove original user_agent
      } else {
        delete formattedData.user_agent; // Don't show for ERROR type
      }

      const metadataStr = Object.entries(formattedData)
        .map(([key, value]) => {
          if (key === 'ip_address') return `ip : ${value}`;
          if (key === 'status_code') return `status : ${value}`;
          if (key === 'browser') return `from : ${value}`;
          return `${key} : ${value}`;
        })
        .filter(Boolean) // Remove empty strings
        .join(' | ');
        
      if (metadataStr) {
        logMessage += ` | ${metadataStr}`;
      }
    }
    
    return logMessage + '\n';
  }

  public info(message: string, data?: LogMetadata) {
    const logMessage = this.formatMessage('INFO', message, data);
    fs.appendFileSync(this.getDailyLogFile(), logMessage);
  }

  public error(message: string, data?: LogMetadata) {
    const logMessage = this.formatMessage('ERROR', message, data);
    fs.appendFileSync(this.getDailyLogFile(), logMessage);
  }

  public action(messageOrAction: string, username: string, metadata?: LogMetadata) {
    const formattedData = {
      username,
      ip_address: metadata?.ip_address || 'Unknown',
      status_code: metadata?.status_code || 200,
      ...metadata
    };
    
    const logMessage = this.formatMessage('ACTION', messageOrAction, formattedData);
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
