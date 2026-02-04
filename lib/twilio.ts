import twilio from "twilio";

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  console.warn("⚠️  Twilio credentials not configured. SMS functionality will not work.");
}

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export const sendOtpSms = async (phone: string, otp: string): Promise<boolean> => {
  if (!twilioClient) {
    console.error("Twilio client not initialized");
    return false;
  }

  try {
    const message = await twilioClient.messages.create({
      body: `Your Nala Armoire Account verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log(`✅ SMS sent successfully to ${phone}. Message SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send SMS:", error);
    return false;
  }
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  
  // Add country code if not present (assuming +91 for India)
  if (!cleaned.startsWith("91") && cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // Add + if not present
  if (!cleaned.startsWith("+")) {
    return `+${cleaned}`;
  }
  
  return cleaned;
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Basic validation for Indian phone numbers (+91 followed by 10 digits)
  const phoneRegex = /^\+91[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};
