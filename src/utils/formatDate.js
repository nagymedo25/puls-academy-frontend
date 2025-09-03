// src/utils/formatDate.js

/**
 * Formats an ISO date string into a user-friendly, relative format,
 * consistently in the "Africa/Cairo" timezone.
 * @param {string} isoString - The ISO date string from the database.
 * @returns {string} The formatted date string.
 */
export const formatTimestamp = (isoString) => {
  if (!isoString) return '';

  // Ensure the date string is parsed as UTC for consistency
  const dateString = isoString.endsWith('Z') ? isoString : isoString + 'Z';
  const date = new Date(dateString);

  // --- ✨ 1. تحديد خيارات التنسيق لتوقيت القاهرة ---
  const cairoDateOptions = { timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit' };
  const cairoTimeOptions = { timeZone: 'Africa/Cairo', hour: 'numeric', minute: '2-digit', hour12: true };

  // --- ✨ 2. الحصول على تاريخ "اليوم" و "الأمس" بتوقيت القاهرة للمقارنة ---
  // نستخدم 'en-CA' للحصول على صيغة YYYY-MM-DD التي تسهل المقارنة
  const todayCairoString = new Date().toLocaleDateString('en-CA', cairoDateOptions);
  const messageCairoString = date.toLocaleDateString('en-CA', cairoDateOptions);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayCairoString = yesterday.toLocaleDateString('en-CA', cairoDateOptions);


  // --- ✨ 3. المقارنة والعرض بناءً على توقيت القاهرة ---
  if (messageCairoString === todayCairoString) {
    // إذا كانت الرسالة اليوم، اعرض الوقت بتوقيت القاهرة
    return date.toLocaleTimeString('ar-EG', cairoTimeOptions);
  }

  if (messageCairoString === yesterdayCairoString) {
    // إذا كانت الرسالة بالأمس
    return 'الأمس';
  }

  // إذا كانت أقدم، اعرض التاريخ الكامل بتوقيت القاهرة
  return date.toLocaleDateString('ar-EG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Africa/Cairo',
  });
};