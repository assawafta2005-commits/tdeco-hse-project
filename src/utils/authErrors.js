/**
 * Maps Firebase Auth error codes to clear Arabic messages for the login
 * screen. Firebase's raw error.message ("Firebase: Error (auth/wrong-
 * password).") is not something to show a non-technical HSE user.
 */
const MESSAGES = {
  "auth/invalid-email": "صيغة البريد الإلكتروني غير صحيحة.",
  "auth/user-disabled": "تم تعطيل هذا الحساب. تواصل مع مسؤول النظام.",
  "auth/user-not-found": "لا يوجد حساب مسجّل بهذا البريد الإلكتروني.",
  "auth/wrong-password": "كلمة المرور غير صحيحة.",
  // Newer Firebase Auth SDK versions merge wrong-password/user-not-found
  // into a single generic code for security reasons — handle both.
  "auth/invalid-credential": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "auth/invalid-login-credentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "auth/too-many-requests": "محاولات كثيرة فاشلة. حاول مرة أخرى بعد قليل.",
  "auth/network-request-failed": "تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت.",
  "auth/configuration-not-found": "إعداد Firebase غير مكتمل في هذا المشروع.",
};

export function mapAuthError(error) {
  const code = error?.code || "";
  if (MESSAGES[code]) return MESSAGES[code];
  if (!code) return "حدث خطأ غير متوقع أثناء تسجيل الدخول.";
  return `حدث خطأ أثناء تسجيل الدخول (${code}).`;
}
