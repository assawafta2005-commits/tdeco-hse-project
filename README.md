# نظام السلامة والصحة المهنية والبيئة — TDECO

تطبيق React + Vite + Firebase لإدارة السلامة والصحة المهنية والبيئة لشركة كهرباء منطقة طوباس.

هذا المشروع تحويل لملف `hse-dashboard.jsx` الأصلي (ملف واحد) إلى مشروع حقيقي متعدد الملفات، مع الحفاظ الكامل على نفس التصميم، الألوان، RTL، والوظائف — بالإضافة إلى Firebase Authentication وFirestore ونظام أدوار/صلاحيات حقيقي.

---

## 1) التثبيت

```bash
npm install
```

## 2) إعداد Firebase

1. أنشئ مشروعًا في [Firebase Console](https://console.firebase.google.com).
2. فعّل **Authentication** (طريقة البريد الإلكتروني/كلمة المرور على الأقل).
3. فعّل **Cloud Firestore**.
4. من إعدادات المشروع (Project settings → General → Your apps) أنشئ تطبيق ويب (Web app) وانسخ بيانات الإعداد.
5. انسخ الملف:

```bash
cp .env.example .env
```

6. افتح `.env` واملأ القيم:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

⚠️ **لا يتم أبدًا** رفع ملف `.env` الحقيقي إلى Git (موجود في `.gitignore` مسبقًا). فقط `.env.example` (بدون قيم حقيقية) يُرفع.

7. انشر قواعد الأمان (`firestore.rules`) على مشروعك، إما عبر Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

أو بلصقها يدويًا في Firebase Console → Firestore Database → Rules.

## 3) إنشاء أول مستخدم Admin

النظام لا يحتوي حاليًا على صفحة تسجيل (Sign up) من الواجهة — وهذا مقصود لأسباب أمنية (لا يجب أن يستطيع أي شخص إنشاء حساب Admin لنفسه). خطوات إنشاء أول Admin:

1. من Firebase Console → Authentication → أضف مستخدمًا يدويًا (بريد إلكتروني + كلمة مرور).
2. انسخ الـ **UID** الخاص بهذا المستخدم من قائمة Authentication.
3. من Firestore Database، أنشئ مستند يدويًا في collection باسم `users`، بمعرّف (Document ID) يساوي نفس الـ UID، وبالحقل:

```
role: "admin"
```

4. سجّل الدخول من التطبيق بنفس البريد وكلمة المرور — سيحصل هذا المستخدم تلقائيًا على صلاحيات Admin الكاملة.

بعد ذلك يمكن لهذا الـAdmin استخدام صفحة **المستخدمون والصلاحيات** لتغيير أدوار بقية المستخدمين (بعد أن ينشئوا حساباتهم عبر تسجيل الدخول لأول مرة — قاعدة الأمان في `firestore.rules` تسمح لكل مستخدم بإنشاء ملفه الشخصي تلقائيًا بدور `viewer` الافتراضي فقط).

## 4) التشغيل محليًا

```bash
npm run dev
```

يعمل التطبيق دون أي ملف `.env` أيضًا — في هذه الحالة، تسجيل الدخول الحقيقي معطّل (ستظهر رسالة توضيحية في صفحة تسجيل الدخول)، لكن جميع صفحات الـDashboard تعمل بالبيانات التجريبية (Mock Data) نفسها الموجودة في الملف الأصلي، لأغراض المعاينة والتطوير.

## 5) البناء (Build)

```bash
npm run build
```

✅ **تم تنفيذ هذا الأمر فعليًا أثناء إنشاء هذا المشروع، ونجح بدون أخطاء.** انظر قسم "حالة الـBuild" أدناه.

للمعاينة المحلية لنسخة الـBuild:

```bash
npm run preview
```

## 6) النشر (Deploy)

الناتج بعد `npm run build` هو مجلد `dist/` — ملف استاتيكي بالكامل، يمكن نشره على أي من:

- **Firebase Hosting** (الأنسب لأنه نفس مشروع Firebase):
  ```bash
  npm install -g firebase-tools
  firebase login
  firebase init hosting   # اختر dist كـ public directory، واختر "Single-page app: Yes"
  firebase deploy --only hosting
  ```
- **Vercel** أو **Netlify**: اربط المستودع، واضبط أمر البناء `npm run build` ومجلد الإخراج `dist`. لا تنسَ إضافة متغيرات `VITE_FIREBASE_*` في إعدادات البيئة (Environment Variables) في لوحة التحكم الخاصة بالمنصة.

---

## هيكل المشروع

انظر قسم "شجرة الملفات" في نهاية هذا الملف.

## نظام الأدوار والصلاحيات

الأدوار: `admin`, `hse_manager`, `hse_officer`, `supervisor`, `employee`, `viewer`, `insurance_officer` — معرّفة في `src/utils/roles.js` ومطبّقة أيضًا في `firestore.rules`.

⚠️ **ملاحظة صريحة**: صلاحيات دوري `Supervisor` و`Employee` لم تكن محددة بالتفصيل في الطلب الأصلي (الذي حدد فقط أمثلة لـAdmin وHSE Manager وHSE Officer وViewer). تم اختيار افتراضات متحفظة (احتمال الإبلاغ عن حادث فقط) — يُنصح بمراجعتها قبل الإنتاج الفعلي. كذلك، صلاحية إدارة المركبات (`MANAGE_VEHICLES`) لم تُذكر صراحة لأي دور في الطلب الأصلي؛ تم افتراض أنها ضمن مسؤوليات `HSE Manager` — وهذا افتراض وليس قرارًا مؤكدًا من العميل.

## حماية صفحة المستخدمين + آلية "إضافة مستخدم"

ثلاث إصلاحات على قسم `/users`:

1. **حماية المسار فعليًا**: `src/components/auth/RequirePermission.jsx` يفحص `MANAGE_USERS` بعد تسجيل الدخول؛ أي مستخدم بدون هذه الصلاحية يُعاد توجيهه فورًا إلى `/dashboard` عند محاولة فتح `/users` مباشرة — وليس فقط إخفاء الرابط.
2. **إخفاء الرابط من Sidebar**: يظهر فقط لمن يملك `MANAGE_USERS` (حاليًا: Admin فقط).
3. **"+ إضافة مستخدم" — قيد تقني حقيقي من Firebase**: لا يمكن لـ Client SDK إنشاء حساب Auth لشخص آخر بدون تسجيل خروج الأدمن الحالي أو استخدام Admin SDK (ممنوع في هذا المشروع). البديل المطبَّق فعليًا: **تخصيص دور مسبقًا بالبريد الإلكتروني** (`pendingUserRoles/{email}`) — الأدمن يحدد البريد والدور من الواجهة، ثم ينشئ الحساب الفعلي يدويًا من Firebase Console كالمعتاد، وعند أول تسجيل دخول بنفس البريد يُطبَّق الدور المحدد تلقائيًا (وتُحذف الدعوة). التحقق من صحة الدور المخصص يتم **من طرف الخادم عبر firestore.rules** (`get()` على `pendingUserRoles`)، وليس بثقة عمياء بما يرسله المتصفح.

## وحدة إدارة التأمين (Insurance Module)

وحدة كاملة منفصلة عن HSE، أُضيفت لاحقًا فوق نفس البنية بدون أي تغيير في التصميم أو المعمارية:

- **البيانات**: مأخوذة حرفيًا من seed الأصلي (`src/data/insuranceMock.js`) — نفس القيم بالضبط.
- **الصفحات**: `src/pages/insurance/` — صفحة قيادة (Dashboard)، صفحة تقارير، صفحة إعدادات، وصفحة قائمة **عامة واحدة** (`InsuranceListPage.jsx`) تُستخدم لكل من: الوثائق، المطالبات، المركبات، الأصول، الموظفين، شركات التأمين، الأقساط والتعويضات، التجديدات، والأرشيف — بنفس فكرة `cfg`/`fields` في الكود الأصلي، لكن عبر `src/config/insuranceListConfig.js`.
- **المجموعات في Firestore**: `insurancePolicies`, `insuranceClaims`, `insuranceVehicles`, `insuranceAssets`, `insuranceEmployees`, `insurers`, `insuranceFinance`, `insuranceRenewals`, `insuranceArchive` — أسماء مختلفة عمدًا عن مجموعات HSE (مثلاً `insuranceVehicles` وليس `vehicles`) لتفادي أي تعارض مع بيانات الأسطول التشغيلي.
- **الصلاحيات**: دور جديد `insurance_officer` (صلاحية `manage_insurance`) — يُعامل بنفس منطق باقي النظام؛ القراءة لأي مستخدم مسجّل دخول، والكتابة/الحذف فقط لـ Admin أو `insurance_officer`، مفروضة في `firestore.rules` وليس فقط بإخفاء الأزرار.
- **لم يُنقل عمدًا**: ميزة "إعادة البيانات الافتراضية" (Reset) من النسخة الأصلية — كانت ستمسح بيانات Firestore حقيقية بضغطة واحدة، وهذا يخالف قاعدة "عدم إنشاء/حذف بيانات تلقائيًا في Firebase" المتبعة في هذا المشروع. بدلها يوجد فقط **تصدير نسخة احتياطية** (آمن، حقيقي).
- **لم تُنشأ مجموعة `users` منفصلة للتأمين** — الوحدة تُعيد استخدام نظام المستخدمين/الأدوار الموجود فعليًا (صفحة "المستخدمون والصلاحيات") بدل اختراع نظام مستخدمين مواز، تمامًا كما طُلب صراحة.

## البيانات التجريبية (Mock Data)

جميع البيانات التجريبية الأصلية موجودة في `src/data/*.js` كما هي تمامًا. كل صفحة تجلب بياناتها عبر `src/services/*.js`، والتي:
- تحاول القراءة من Firestore أولًا (إن كان مهيّأً).
- **تعود تلقائيًا** لنفس البيانات التجريبية إن لم يكن Firestore مهيّأً أو كانت المجموعة (Collection) فارغة/غير موجودة.

هذا يعني أن حذف الـMock Data لاحقًا يجب أن يتم فقط بعد التأكد أن البيانات الحقيقية في Firestore تعمل، تمامًا كما طُلب.

## سجل التدقيق (Audit Log)

كل عملية حساسة تُسجَّل عبر `src/services/auditLogService.js` في مجموعة `auditLogs`: `login`, `logout`, `create_incident`, `update_incident`, `delete_record`, `create_risk`, `update_risk`, `create_vehicle`, `update_vehicle`, `delete_record`, `role_change`, `submit_form`, `create_sop`. كل سجل يشمل: `userId`, `action`, `resource`, `resourceId`, `timestamp` (تلقائي من الخادم عبر `serverTimestamp()`), و`metadata` اختياري. **لا يتم تسجيل أي كلمة مرور أو token أو معلومة حساسة** في الـmetadata. سجل التدقيق **قابل للإضافة فقط** (Append-only) — `firestore.rules` تمنع أي تعديل أو حذف حتى من قبل Admin.

## حالة CRUD الفعلية لكل قسم

| القسم | القراءة | إنشاء | حذف | تعديل |
|---|---|---|---|---|
| الحوادث | ✅ Firestore/Mock مع Loading/Empty/Error | ✅ نافذة منبثقة فعلية | ✅ زر حذف (محمي بالصلاحية) | — (لم يُبنَ في هذا الإصدار) |
| المخاطر | ✅ | ✅ | ✅ | — |
| المركبات | ✅ | ✅ | ✅ | — |
| SOPs | ✅ | — (لا يوجد زر إنشاء في التصميم الأصلي) | — | — |
| الدليل (Documents) | ✅ | — | — | — |
| النماذج والسجلات | ✅ | — (الزر موجود بصريًا فقط كما في التصميم الأصلي) | — | — |
| التقارير | ✅ | — | — | — |
| المستخدمون | ✅ | — (زر "إضافة مستخدم" بصري فقط — الإضافة تتم عبر Firebase Authentication ثم يظهر المستخدم تلقائيًا) | — | ✅ تغيير الدور (محمي بصلاحية Admin) |

**بصراحة**: لم يُطلب "تعديل" (Update) صريح لكل سجل عبر واجهة مستخدم في هذا الإصدار — الأولوية كانت لإنشاء أول عملية CRUD فعلية وكاملة الأمان (قراءة حقيقية + إنشاء حقيقي + حذف محمي بالصلاحية + تسجيل تدقيق) لثلاثة أقسام (الحوادث، المخاطر، المركبات)، بدل نشر أزرار "تعديل" غير مكتملة الوظيفة على كل الجداول. يمكن إضافة نماذج تعديل بنفس النمط المستخدم في نوافذ الإنشاء بسهولة لاحقًا.

## أشياء لا يمكن اختبارها بدون Firebase Project حقيقي

كانت هذه نقطة مهمة طُلب توضيحها صراحة بدل افتراض أنها تعمل. القائمة التالية **لم يتم اختبارها فعليًا** لأنها تتطلب اتصالًا حيًا بمشروع Firebase حقيقي (وهذا غير متاح في بيئة التطوير الحالية):

- **تسجيل الدخول الفعلي** عبر Firebase Authentication، بما في ذلك رسائل الخطأ الفعلية (`auth/wrong-password`, `auth/user-not-found`, `auth/invalid-credential`, `auth/too-many-requests`, `auth/network-request-failed`...) — تم بناء خريطة ترجمة عربية كاملة لهذه الأكواد في `src/utils/authErrors.js`، لكن لم تُختبر ضد Firebase حقيقي لتأكيد أن كل كود يظهر فعليًا كما هو متوقع.
- **Session persistence** — تم استدعاء `setPersistence(auth, browserLocalPersistence)` صراحة، لكن لم يُختبر عبر إغلاق/فتح المتصفح فعليًا.
- **قراءة/كتابة/حذف البيانات الفعلية من Firestore**، بما فيها الحالات الثلاث (Loading/Empty/Error) — تم بناء المنطق ليفرّق بوضوح بين "لا توجد بيانات" (Empty) و"فشل الاتصال" (Error) و"Firebase غير مهيأ" (Mock)، لكن لم يُختبر ضد قاعدة بيانات Firestore حقيقية.
- **إنشاء مستند المستخدم تلقائيًا (Self-provisioning)** عند أول تسجيل دخول — الكود موجود في `AuthContext.jsx` ويُفترض أنه يعمل منطقيًا، لكن لم يُختبر فعليًا.
- **قواعد الأمان (`firestore.rules` و`storage.rules`)** — تمت كتابتها لتُطابق مصفوفة الأدوار في `roles.js` منطقيًا، لكن **لم يتم نشرها أو اختبارها فعليًا على مشروع Firebase حقيقي**. يُنصح بشدة باختبارها عبر [Firestore Rules Playground](https://firebase.google.com/docs/firestore/security/test-rules-emulator) أو Firebase Emulator Suite قبل الإنتاج — خصوصًا اختبار أن Viewer فعليًا **لا يستطيع** حذف Incident حتى عبر استدعاء مباشر لـ Firestore SDK من console المتصفح.
- **Firebase Storage** — `src/services/storageService.js` جاهز (`uploadFile`, `deleteFile`) و`storage.rules` مكتوبة، لكن **لا توجد أي واجهة رفع ملفات في أي صفحة** في هذا الإصدار (التصميم الأصلي لم يتضمن مثل هذه الواجهة، والتعليمات كانت صريحة بعدم تغيير التصميم أو إضافة تفاعلات جديدة). الخدمة جاهزة للاستخدام فور إضافة عنصر رفع ملف في أي صفحة مستقبلًا.
- **PWA (قابلية التثبيت الفعلية على جهاز)** — تم بناء Service Worker بنجاح عبر `vite-plugin-pwa`، لكن اختبار "تثبيت التطبيق" الفعلي يتطلب متصفحًا حقيقيًا وهو غير متاح في هذه البيئة.
- أيقونات PWA (`public/icons/*.png`) هي **أيقونات مؤقتة (Placeholders)** بنفس ألوان الهوية — ليست تصميمًا رسميًا معتمدًا من الشركة.

## حالة الـBuild النهائية

```
npm install     → نجح (بدون أخطاء)
npm run build   → نجح (vite build, 1577 module transformed — بعد إضافة وحدة التأمين)
```

تحذير أداء واحد (غير حرج): حزمة الـJS الرئيسية ~745KB (~191KB بعد ضغط gzip) — أكبر من الحد المستحسن 500KB. هذا لا يمنع عمل التطبيق، لكن يمكن تحسينه لاحقًا عبر `React.lazy()` لتقسيم الصفحات (code-splitting).

## خطوات Firebase Console خطوة بخطوة (لإنهاء الإعداد)

1. **إنشاء المشروع**: [console.firebase.google.com](https://console.firebase.google.com) → Add project → أدخل اسمًا (مثلًا `tdeco-hse`) → أكمل المعالج.
2. **تفعيل Authentication**: من القائمة الجانبية → Build → Authentication → Get started → في تبويب Sign-in method فعّل **Email/Password**.
3. **تفعيل Firestore**: Build → Firestore Database → Create database → اختر وضع الإنتاج (Production mode) → اختر المنطقة الجغرافية الأقرب.
4. **تفعيل Storage** (اختياري، فقط إذا ستُستخدم لاحقًا): Build → Storage → Get started.
5. **إنشاء تطبيق ويب**: من صفحة المشروع الرئيسية (Project Overview) → أيقونة `</>` (Web) → أدخل اسم التطبيق → Register app → انسخ قيم `firebaseConfig` الظاهرة إلى ملف `.env` لديك (كما في القسم 2 أعلاه).
6. **نشر قواعد الأمان**: Firestore Database → Rules → الصق محتوى `firestore.rules` → Publish. وبنفس الطريقة: Storage → Rules → الصق `storage.rules` → Publish.
7. **إنشاء أول Admin**: اتبع الخطوات في قسم "إنشاء أول مستخدم Admin" أعلاه (Authentication → Add user، ثم Firestore → إنشاء مستند يدوي في `users` بنفس الـUID مع `role: "admin"`).
8. **(اختياري) النشر عبر Firebase Hosting**: راجع قسم "النشر (Deploy)" أعلاه.


## شجرة الملفات النهائية

```
.
.env.example
.gitignore
README.md
firestore.rules
index.html
package-lock.json
package.json
postcss.config.js
public
public/favicon.png
public/icons
public/icons/icon192.png
public/icons/icon512.png
public/icons/maskable512.png
public/manifest.json
src
src/App.jsx
src/components
src/components/auth
src/components/auth/ProtectedRoute.jsx
src/components/auth/RequirePermission.jsx
src/components/auth/RoleGate.jsx
src/components/common
src/components/common/DataStatus.jsx
src/components/common/MetricCard.jsx
src/components/common/Modal.jsx
src/components/common/Placeholder.jsx
src/components/common/SectionHeading.jsx
src/components/layout
src/components/layout/DashboardLayout.jsx
src/components/layout/Header.jsx
src/components/layout/Sidebar.jsx
src/config
src/config/insuranceListConfig.js
src/context
src/context/AuthContext.jsx
src/data
src/data/builderMock.js
src/data/dashboardMock.js
src/data/fleetMock.js
src/data/formsMock.js
src/data/incidentsMock.js
src/data/insuranceMock.js
src/data/insuranceNavItems.js
src/data/manualMock.js
src/data/navItems.js
src/data/reportsMock.js
src/data/risksMock.js
src/data/sopsMock.js
src/hooks
src/hooks/useAuth.js
src/hooks/useServiceData.js
src/index.css
src/lib
src/lib/firebase.js
src/main.jsx
src/pages
src/pages/DashboardPage.jsx
src/pages/FleetPage.jsx
src/pages/FormsLogsPage.jsx
src/pages/IncidentsPage.jsx
src/pages/LoginPage.jsx
src/pages/ManualBuilderPage.jsx
src/pages/ManualPage.jsx
src/pages/MinistryFormsPage.jsx
src/pages/ReportsPage.jsx
src/pages/RisksPage.jsx
src/pages/SopsPage.jsx
src/pages/UsersPermissionsPage.jsx
src/pages/insurance
src/pages/insurance/InsuranceDashboardPage.jsx
src/pages/insurance/InsuranceListPage.jsx
src/pages/insurance/InsuranceReportsPage.jsx
src/pages/insurance/InsuranceSettingsPage.jsx
src/services
src/services/auditLogService.js
src/services/documentsService.js
src/services/firestoreService.js
src/services/formsService.js
src/services/incidentsService.js
src/services/insuranceService.js
src/services/reportsService.js
src/services/risksService.js
src/services/sopsService.js
src/services/storageService.js
src/services/usersService.js
src/services/vehiclesService.js
src/utils
src/utils/authErrors.js
src/utils/roles.js
storage.rules
tailwind.config.js
vite.config.js
```
