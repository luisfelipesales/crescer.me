/**
 * Contact detection utility for chat moderation
 * Detects phone numbers, emails, URLs, and social media handles
 * to prevent off-platform communication
 */

interface DetectionResult {
  hasContact: boolean;
  type: "phone" | "email" | "url" | "social" | null;
  match: string | null;
}

// Brazilian phone patterns (with or without country code, various formats)
const PHONE_PATTERNS = [
  /\+?55\s*\d{2}\s*9?\d{4}[-.\s]?\d{4}/gi, // +55 11 99999-9999
  /\(?\d{2}\)?\s*9?\d{4}[-.\s]?\d{4}/gi, // (11) 99999-9999 or 11999999999
  /\d{4,5}[-.\s]\d{4}/gi, // 99999-9999 or 9999-9999
  /\d{10,11}/g, // 11999999999 (continuous digits)
];

// Email pattern
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

// URL patterns (various formats)
const URL_PATTERNS = [
  /https?:\/\/[^\s]+/gi,
  /www\.[^\s]+/gi,
  /[a-zA-Z0-9-]+\.(com|com\.br|net|org|io|app|me|co)[^\s]*/gi,
];

// Social media handles and keywords
const SOCIAL_PATTERNS = [
  /@[a-zA-Z0-9_]{3,}/gi, // @username
  /whatsapp/gi,
  /whats\s*app/gi,
  /wpp/gi,
  /zap/gi,
  /zapzap/gi,
  /instagram/gi,
  /insta/gi,
  /telegram/gi,
  /facebook/gi,
  /fb\b/gi,
  /linkedin/gi,
  /twitter/gi,
  /tiktok/gi,
  /me\s*chama\s*(no|pelo)/gi,
  /meu\s*(número|numero|telefone|celular|zap|whats)/gi,
  /liga\s*(pra|para)\s*mim/gi,
  /manda\s*mensagem/gi,
];

/**
 * Checks if a message contains contact information
 */
export function detectContactInfo(message: string): DetectionResult {
  const normalizedMessage = message.toLowerCase().trim();

  // Skip very short messages
  if (normalizedMessage.length < 5) {
    return { hasContact: false, type: null, match: null };
  }

  // Check for phone numbers
  for (const pattern of PHONE_PATTERNS) {
    const match = message.match(pattern);
    if (match && match[0].replace(/\D/g, "").length >= 8) {
      return { hasContact: true, type: "phone", match: match[0] };
    }
  }

  // Check for emails
  const emailMatch = message.match(EMAIL_PATTERN);
  if (emailMatch) {
    // Allow platform emails
    if (!emailMatch[0].includes("crescer.me") && !emailMatch[0].includes("@crescer")) {
      return { hasContact: true, type: "email", match: emailMatch[0] };
    }
  }

  // Check for URLs
  for (const pattern of URL_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      // Allow platform URLs
      if (!match[0].includes("crescer")) {
        return { hasContact: true, type: "url", match: match[0] };
      }
    }
  }

  // Check for social media patterns
  for (const pattern of SOCIAL_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      return { hasContact: true, type: "social", match: match[0] };
    }
  }

  return { hasContact: false, type: null, match: null };
}

/**
 * Gets a user-friendly message explaining why contact sharing is blocked
 */
export function getBlockedContactMessage(type: DetectionResult["type"]): string {
  const baseMessage = "Para sua segurança e para manter o suporte do Crescer, contatos diretos não são compartilhados aqui.";
  
  const alternatives: Record<string, string> = {
    phone: "Você pode agendar consultas e falar com a equipe pela plataforma.",
    email: "Use o chat interno para se comunicar ou entre em contato com o suporte.",
    url: "Se precisar compartilhar informações, use o chat interno da plataforma.",
    social: "Toda comunicação com terapeutas deve ser feita pela plataforma Crescer.",
  };

  return `${baseMessage}\n\n${alternatives[type || "phone"]}`;
}
