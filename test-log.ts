
import { logger } from '@/utils/logger';

// ทดสอบบันทึก log
logger.info('ทดสอบ log', { test: 'hello' });
logger.error('ทดสอบ error');
logger.action('ทดสอบ', 'admin', { action: 'test' });