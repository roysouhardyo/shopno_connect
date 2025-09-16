import axios from 'axios';

const BULKSMSBD_API_KEY = process.env.BULKSMSBD_API_KEY!;
const BULKSMSBD_SENDER_ID = process.env.BULKSMSBD_SENDER_ID!;

if (!BULKSMSBD_API_KEY || !BULKSMSBD_SENDER_ID) {
  console.warn('BulkSMSBD credentials not configured. SMS functionality will be disabled.');
}

export interface SMSResponse {
  success: boolean;
  message: string;
  messageId?: string;
}

export async function sendOTP(phone: string, otp: string): Promise<SMSResponse> {
  try {
    // Remove +88 prefix if present for BulkSMSBD
    const formattedPhone = phone.startsWith('+88') ? phone.substring(3) : phone;
    
    const message = `Your Shopnonagar Connect verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`;

    // If credentials are not configured, simulate success for development
    if (!BULKSMSBD_API_KEY || !BULKSMSBD_SENDER_ID) {
      console.log(`[DEV MODE] SMS to ${phone}: ${message}`);
      return {
        success: true,
        message: 'SMS sent successfully (development mode)',
        messageId: 'dev-' + Date.now()
      };
    }

    const response = await axios.post('https://api.bulksmsbd.com/api/smsapi', {
      api_key: BULKSMSBD_API_KEY,
      senderid: BULKSMSBD_SENDER_ID,
      number: formattedPhone,
      message: message
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 seconds timeout
    });

    if (response.data && response.data.response_code === 202) {
      return {
        success: true,
        message: 'SMS sent successfully',
        messageId: response.data.message_id
      };
    } else {
      return {
        success: false,
        message: response.data?.error_message || 'Failed to send SMS'
      };
    }
  } catch (error: any) {
    console.error('SMS sending error:', error);
    return {
      success: false,
      message: error.response?.data?.error_message || 'Failed to send SMS'
    };
  }
}

export async function sendNotificationSMS(phone: string, message: string): Promise<SMSResponse> {
  try {
    const formattedPhone = phone.startsWith('+88') ? phone.substring(3) : phone;
    
    // If credentials are not configured, simulate success for development
    if (!BULKSMSBD_API_KEY || !BULKSMSBD_SENDER_ID) {
      console.log(`[DEV MODE] Notification SMS to ${phone}: ${message}`);
      return {
        success: true,
        message: 'Notification SMS sent successfully (development mode)',
        messageId: 'dev-notification-' + Date.now()
      };
    }

    const response = await axios.post('https://api.bulksmsbd.com/api/smsapi', {
      api_key: BULKSMSBD_API_KEY,
      senderid: BULKSMSBD_SENDER_ID,
      number: formattedPhone,
      message: message
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (response.data && response.data.response_code === 202) {
      return {
        success: true,
        message: 'Notification SMS sent successfully',
        messageId: response.data.message_id
      };
    } else {
      return {
        success: false,
        message: response.data?.error_message || 'Failed to send notification SMS'
      };
    }
  } catch (error: any) {
    console.error('Notification SMS sending error:', error);
    return {
      success: false,
      message: error.response?.data?.error_message || 'Failed to send notification SMS'
    };
  }
}