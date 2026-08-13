<!-- PROJECT SHIELDS -->
<!--
*** 本文档使用 Shields.io 标准徽章，参考了 best practices 和官方文档。
-->

<div align="center">

# 🤖 Telegram Anonymous Chat Bot

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Telegram Bot](https://img.shields.io/badge/Telegram_Bot-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://telegram.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GrammY](https://img.shields.io/badge/GrammY-1.24.0-00C7B7?style=for-the-badge&logo=telegram&logoColor=white)](https://grammy.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/mehrdadmb2/Telegram-Anonymous-Chat-Bot/pulls)
[![GitHub stars](https://img.shields.io/github/stars/mehrdadmb2/Telegram-Anonymous-Chat-Bot?style=for-the-badge)](https://github.com/mehrdadmb2/Telegram-Anonymous-Chat-Bot/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/mehrdadmb2/Telegram-Anonymous-Chat-Bot?style=for-the-badge)](https://github.com/mehrdadmb2/Telegram-Anonymous-Chat-Bot/network/members)
[![GitHub issues](https://img.shields.io/github/issues/mehrdadmb2/Telegram-Anonymous-Chat-Bot?style=for-the-badge)](https://github.com/mehrdadmb2/Telegram-Anonymous-Chat-Bot/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/mehrdadmb2/Telegram-Anonymous-Chat-Bot?style=for-the-badge)](https://github.com/mehrdadmb2/Telegram-Anonymous-Chat-Bot/commits/main)

</div>

---

<div align="center">
  <h3>💬 ارسال و دریافت پیام‌های ناشناس در تلگرام</h3>
  <h4>⚡ کاملاً ناشناس • امن • حرفه‌ای</h4>
  <h5>🔗 <a href="https://t.me/NashnasiChatBot">مشاهده دموی ربات در تلگرام</a></h5>
</div>

---

## 🌟 درباره پروژه

**Telegram Anonymous Chat Bot** یک ربات حرفه‌ای، امن و کامل برای ارسال و دریافت پیام‌های ناشناس در تلگرام است. این ربات با استفاده از **Cloudflare Workers** پیاده‌سازی شده و کاملاً رایگان و مقیاس‌پذیر اجرا می‌شود.

### 🔥 ویژگی‌های برجسته
- 🔗 **لینک شخصی** – هر کاربر یک لینک اختصاصی برای دریافت پیام‌های ناشناس دارد
- 📨 **ارسال انواع رسانه** – پشتیبانی از متن، عکس، ویدیو، گیف، صدا، فایل و استیکر
- 💬 **پاسخ ناشناس** – پاسخ به پیام‌ها بدون فاش شدن هویت
- 📜 **تاریخچه پیام‌ها** – مشاهده کامل پیام‌های دریافتی با زمان و تاریخ
- 👤 **اطلاعات کاربری** – مشاهده آمار، تاریخ عضویت و آخرین فعالیت
- 🚫 **مدیریت بلاک** – بلاک و آنبلاک فرستنده‌های مزاحم
- 👑 **پنل ادمین** – مدیریت کامل کاربران، آمار و ارسال همگانی

---

## 📋 فهرست دستورات

### 👤 دستورات کاربران عادی

| دستور | توضیح |
|-------|-------|
| `/start` | شروع ربات و دریافت لینک شخصی |
| `/link` | دریافت مجدد لینک شخصی |
| `/history` | مشاهده تاریخچه پیام‌های دریافتی |
| `/me` | مشاهده اطلاعات کاربری |
| `/blocklist` | لیست کاربران بلاک‌شده |
| `/unblock [ID]` | رفع بلاک کاربر با آیدی عددی |
| `/help` | راهنمای کامل ربات |

### 👑 دستورات ادمین

| دستور | توضیح |
|-------|-------|
| `/admin` | پنل مدیریت پیشرفته |
| `/users` | لیست کامل کاربران با جزئیات |
| `/stats` | آمار دقیق پیام‌ها و فایل‌ها |
| `/broadcast [متن]` | ارسال پیام همگانی به همه کاربران |
| `/send [ID] [متن]` | ارسال پیام به کاربر خاص با آیدی |
| `/block [ID]` | بلاک کردن کاربر با آیدی عددی |
| `/unblock [ID]` | رفع بلاک کاربر با آیدی عددی |

---

## 🛠️ تکنولوژی‌های استفاده‌شده

| تکنولوژی | کاربرد |
|-----------|--------|
| [Cloudflare Workers](https://workers.cloudflare.com/) | اجرای سرورلس و مقیاس‌پذیر |
| [Cloudflare KV](https://developers.cloudflare.com/kv/) | پایگاه داده کلید-مقدار |
| [GrammY](https://grammy.dev/) | فریم‌ورک ساخت ربات تلگرام |
| [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | زبان برنامه‌نویسی |

---

## 🚀 راه‌اندازی و نصب (۰ تا ۱۰۰)

### پیش‌نیازها

- [Node.js](https://nodejs.org/) نسخه ۱۸ یا بالاتر
- [Cloudflare](https://dash.cloudflare.com/sign-up) اکانت رایگان
- [توکن ربات تلگرام](https://t.me/BotFather) از @BotFather

---

### مرحله ۱: کلون کردن مخزن

```bash
git clone https://github.com/mehrdadmb2/Telegram-Anonymous-Chat-Bot.git
cd Telegram-Anonymous-Chat-Bot
```

---

### مرحله ۲: نصب وابستگی‌ها

```bash
npm install
```

---

### مرحله ۳: تنظیم فایل `wrangler.toml`

فایل `wrangler.toml` را با محتوای زیر ایجاد کنید:

```toml
name = "anonymous-chat-bot"
main = "index.js"
compatibility_date = "2024-10-22"

[[kv_namespaces]]
binding = "KV"
id = "YOUR_KV_NAMESPACE_ID"   # ← آیدی KV خود را اینجا قرار دهید
```

---

### مرحله ۴: ایجاد KV Namespace در Cloudflare

```bash
npx wrangler kv namespace create anonymous_chat_kv
```

خروجی مشابه زیر را مشاهده خواهید کرد:

```
✨ Success!
🎉 Created KV namespace with ID: 3a95e2c5225945e581e2ae01cb5c16d5
```

آیدی (`ID`) را کپی کرده و در فایل `wrangler.toml` قرار دهید.

---

### مرحله ۵: تنظیم متغیرهای محیطی (Secrets)

```bash
# توکن ربات تلگرام
npx wrangler secret put BOT_TOKEN

# آیدی عددی ادمین (از @userinfobot دریافت کنید)
npx wrangler secret put ADMIN_ID

# یک رشته تصادفی برای رمزنگاری
npx wrangler secret put SALT
```

---

### مرحله ۶: دیپلوی ربات روی Cloudflare Workers

```bash
npx wrangler deploy
```

پس از دیپلوی، آدرس Worker خود را دریافت خواهید کرد، مانند:

```
https://anonymous-chat-bot.your-username.workers.dev
```

---

### مرحله ۷: تنظیم Webhook

برای اتصال ربات به تلگرام، آدرس زیر را در مرورگر باز کنید:

```
https://anonymous-chat-bot.your-username.workers.dev/register
```

در صورت موفقیت، خروجی زیر را مشاهده خواهید کرد:

```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

---

### مرحله ۸: تنظیم دستورات در BotFather

به [@BotFather](https://t.me/BotFather) بروید و دستور `/setcommands` را ارسال کنید. سپس ربات خود را انتخاب کرده و لیست زیر را کپی کنید:

```
start - شروع ربات و دریافت لینک شخصی
link - دریافت مجدد لینک شخصی
help - راهنمای کامل ربات
history - مشاهده تاریخچه پیام های دریافتی
me - مشاهده اطلاعات کاربری شما
blocklist - نمایش لیست کاربران بلاک شده
unblock - رفع بلاک کاربر با آیدی عددی
admin - پنل مدیریت پیشرفته
users - لیست کامل کاربران با جزئیات
stats - آمار دقیق پیام ها و فایل ها
broadcast - ارسال پیام همگانی به همه کاربران
send - ارسال پیام به کاربر خاص با آیدی
block - بلاک کردن کاربر با آیدی عددی
```

---

### ✅ ربات شما آماده‌ست!

حالا می‌توانید ربات خود را در تلگرام پیدا کرده و با ارسال `/start` از آن استفاده کنید.

---

## 📁 ساختار پروژه

```
Telegram-Anonymous-Chat-Bot/
├── index.js              # کد اصلی ربات
├── wrangler.toml         # تنظیمات Cloudflare Workers
├── package.json          # وابستگی‌های پروژه
├── README.md             # مستندات پروژه
├── LICENSE               # مجوز MIT
└── .gitignore           # فایل‌های نادیده‌گرفته‌شده در گیت
```

---

## 🔧 ساختار KV و ذخیره‌سازی داده‌ها

| کلید (Key Pattern) | توضیح |
|---------------------|-------|
| `user:{userId}` | کلید لینک شخصی کاربر |
| `link:{linkKey}` | نگاشت کلید لینک به آیدی کاربر |
| `linked:{userId}` | لیست کاربرانی که به این کاربر پیام داده‌اند |
| `blocked:{userId}:{senderId}` | وضعیت بلاک |
| `history:{userId}` | تاریخچه پیام‌های دریافتی |
| `admin:users` | لیست همه کاربران ربات |
| `joined:{userId}` | تاریخ عضویت کاربر |
| `lastseen:{userId}` | آخرین فعالیت کاربر |

---

## 🤝 مشارکت در توسعه

از مشارکت شما استقبال می‌کنیم! لطفاً مراحل زیر را دنبال کنید:

1. مخزن را **Fork** کنید
2. یک **Branch** جدید ایجاد کنید (`git checkout -b feature/AmazingFeature`)
3. تغییرات خود را اعمال کنید (`git commit -m 'Add some AmazingFeature'`)
4. Branch را Push کنید (`git push origin feature/AmazingFeature`)
5. یک **Pull Request** باز کنید

---

## 📄 مجوز

این پروژه تحت مجوز **MIT** منتشر شده است. برای اطلاعات بیشتر فایل [LICENSE](LICENSE) را مشاهده کنید.

---

## 🙏 سپاس‌گزاری

- [GrammY](https://grammy.dev/) – فریم‌ورک فوق‌العاده ساخت ربات تلگرام
- [Cloudflare](https://cloudflare.com/) – زیرساخت رایگان و مقیاس‌پذیر
- همه مشارکت‌کنندگان و کاربران این ربات

---

## 📞 ارتباط با ما

- **ربات دمو:** [@NashnasiChatBot](https://t.me/NashnasiChatBot)
- **گزارش مشکل:** [صفحه Issues](https://github.com/mehrdadmb2/Telegram-Anonymous-Chat-Bot/issues)
- **گفت‌وگو:** [صفحه Discussions](https://github.com/mehrdadmb2/Telegram-Anonymous-Chat-Bot/discussions)

---

<div align="center">
  <sub>ساخته شده با ❤️ توسط <a href="https://github.com/mehrdadmb2">mehrdadmb2</a></sub>
</div>
- **بخش `YOUR_KV_NAMESPACE_ID`** در `wrangler.toml` باید با آیدی واقعی KV شما جایگزین شود.

در صورت نیاز به تغییرات یا اضافه کردن بخش‌های دیگر، خوشحال می‌شوم کمک کنم! 🚀
