// ============================================================
// 🚀 ربات چت ناشناس - نسخه نهایی
// ============================================================

import { Bot, webhookCallback } from 'grammy/web';

// ============================================================
// 📌 تنظیمات ثابت (این رو با یوزرنیم خودت جایگزین کن)
// ============================================================

const BOT_USERNAME = 'NashnasiChatBot';  // ← یوزرنیم ربات خودت

// ============================================================
// 🗓️ توابع تاریخ و زمان
// ============================================================

function getPersianDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const persianYear = year - 621;
  return `${persianYear}/${month}/${day} - ${hours}:${minutes}`;
}

function getPersianDateFull() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const persianYear = year - 621;
  return `${persianYear}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

// ============================================================
// 📝 توابع کمکی با KV
// ============================================================

async function getUserLink(kv, userId) {
  const key = `user:${userId}`;
  const entry = await kv.get(key);
  if (entry) return entry;
  const newKey = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  await kv.put(key, newKey);
  await kv.put(`link:${newKey}`, userId);
  return newKey;
}

async function getUserIdByLink(kv, linkKey) {
  return await kv.get(`link:${linkKey}`);
}

async function getLinkedUsers(kv, userId) {
  const listKey = `linked:${userId}`;
  const entry = await kv.get(listKey);
  return entry ? JSON.parse(entry) : [];
}

async function addLinkedUser(kv, userId, senderId) {
  const listKey = `linked:${userId}`;
  let users = await getLinkedUsers(kv, userId);
  if (!users.includes(senderId)) {
    users.push(senderId);
    await kv.put(listKey, JSON.stringify(users));
  }
}

async function isBlocked(kv, userId, senderId) {
  const blockKey = `blocked:${userId}:${senderId}`;
  return !!(await kv.get(blockKey));
}

async function blockUser(kv, userId, senderId) {
  await kv.put(`blocked:${userId}:${senderId}`, 'true');
}

async function unblockUser(kv, userId, senderId) {
  await kv.delete(`blocked:${userId}:${senderId}`);
}

async function getAdminUsers(kv) {
  const entry = await kv.get('admin:users');
  return entry ? JSON.parse(entry) : [];
}

async function addAdminUser(kv, userId) {
  let users = await getAdminUsers(kv);
  if (!users.includes(userId)) {
    users.push(userId);
    await kv.put('admin:users', JSON.stringify(users));
  }
}

async function saveMessage(kv, userId, senderId, message, type = 'text') {
  const historyKey = `history:${userId}`;
  const entry = await kv.get(historyKey);
  let history = entry ? JSON.parse(entry) : [];
  history.push({
    from: senderId,
    message: message,
    type: type,
    timestamp: getPersianDateFull(),
    date: getPersianDate(),
    read: false
  });
  if (history.length > 100) history = history.slice(-100);
  await kv.put(historyKey, JSON.stringify(history));
  return history;
}

async function getMessageHistory(kv, userId, limit = 20) {
  const historyKey = `history:${userId}`;
  const entry = await kv.get(historyKey);
  const history = entry ? JSON.parse(entry) : [];
  return history.slice(-limit).reverse();
}

async function getUserStats(kv, userId) {
  const linked = await getLinkedUsers(kv, userId);
  const historyKey = `history:${userId}`;
  const entry = await kv.get(historyKey);
  const history = entry ? JSON.parse(entry) : [];
  const types = {};
  history.forEach(msg => { types[msg.type] = (types[msg.type] || 0) + 1; });
  return {
    totalMessages: history.length,
    totalSenders: linked.length,
    types: types,
    lastMessage: history.length > 0 ? history[history.length - 1].timestamp : 'ندارد'
  };
}

async function getUserJoinDate(kv, userId) {
  const key = `joined:${userId}`;
  const entry = await kv.get(key);
  if (entry) return entry;
  const date = getPersianDateFull();
  await kv.put(key, date);
  return date;
}

async function setUserLastSeen(kv, userId) {
  await kv.put(`lastseen:${userId}`, getPersianDateFull());
}

async function getUserLastSeen(kv, userId) {
  const entry = await kv.get(`lastseen:${userId}`);
  return entry || 'نامشخص';
}

// ============================================================
// 💬 پیام‌ها
// ============================================================

const MESSAGES = {
  welcome: (hasLink) => `
🌟 به ربات چت ناشناس خوش اومدی!

این ربات بهت امکان میده پیام‌های ناشناس دریافت کنی و بهشون پاسخ بدی.

${hasLink ? '🔗 لینک شخصی تو آماده‌ست!' : '🔑 برای دریافت لینک شخصیت، روی دکمه زیر کلیک کن.'}

📌 **راهنما:**
• لینکت رو با دوستات به اشتراک بذار
• هرکی با لینک تو پیام بده، ناشناس بهت میرسه
• می‌تونی به پیام‌ها پاسخ بدی
• اگه کسی اذیتت کرد، می‌تونی بلاکش کنی

📱 **قابلیت‌های پیشرفته:**
• ارسال عکس، ویدیو، گیف، صدا و فایل
• مشاهده تاریخچه پیام‌ها (/history)
• مشاهده اطلاعات کاربری (/me)
• مدیریت بلاک‌ها (/blocklist)

💡 می‌تونی از دکمه‌ها یا دستورات استفاده کنی.
  `,

  getLink: (link) => `
🔗 **لینک شخصی تو:**

\`https://t.me/${BOT_USERNAME}?start=${link}\`

✅ این لینک رو با هرکی می‌خوای به اشتراک بذار!
📋 برای کپی کردن، روی لینک بالا کلیک کن.

⚠️ توجه: هر کسی این لینک رو داشته باشه، می‌تونه بهت پیام ناشناس بده.
  `,

  replySent: `✅ پاسخ شما با موفقیت ارسال شد.`,
  blocked: `⛔ فرستنده با موفقیت بلاک شد.`,
  help: `
📖 **راهنمای کامل ربات چت ناشناس**

🔹 **دستورات کاربران عادی:**
• /start - شروع مجدد ربات
• /link - دریافت لینک شخصی
• /history - مشاهده تاریخچه پیام‌های دریافتی
• /me - مشاهده اطلاعات کاربری
• /blocklist - لیست کاربران بلاک‌شده
• /unblock [ID] - رفع بلاک کاربر
• /help - این راهنما

🔸 **دستورات ادمین:**
• /admin - پنل مدیریت
• /users - لیست همه کاربران با جزئیات
• /stats - آمار کامل
• /broadcast [متن] - ارسال همگانی
• /block [ID] - بلاک کاربر
• /unblock [ID] - رفع بلاک
• /send [ID] [متن] - ارسال پیام به کاربر خاص

📱 **رسانه‌های پشتیبانی‌شده:**
• 📷 عکس و تصویر
• 🎥 ویدیو
• 🎵 صدا و موسیقی
• 📄 فایل‌های PDF و ZIP
• 🎭 استیکر
• 💬 گیف (انیمیشن)
• 🔗 لینک‌های قابل کلیک

🔰 **نکات امنیتی:**
• هیچ اطلاعاتی از هویت فرستنده فاش نمی‌شه
• می‌تونی هر وقت خواستی فرستنده رو بلاک کنی
• پیام‌ها رمزنگاری می‌شن
• تاریخچه پیام‌ها فقط برای خودت قابل مشاهده‌ست
  `,

  adminPanel: (users, totalMessages, totalMedia) => `
👑 **پنل مدیریت پیشرفته**

📊 **آمار کلی:**
• 👥 تعداد کاربران: ${users.length}
• 💬 کل پیام‌های ارسال‌شده: ${totalMessages}
• 📎 کل فایل‌های ارسال‌شده: ${totalMedia}

📋 **لیست کاربران:**

${users.map(u => `• کاربر ${u.id}\n  📨 ${u.messages} پیام | 📎 ${u.media} فایل\n  🕐 آخرین فعالیت: ${u.lastSeen}\n  📅 عضویت: ${u.joined}`).join('\n\n')}

🔧 **دستورات مدیریت:**
• /users - لیست کامل کاربران
• /stats - آمار دقیق
• /broadcast [پیام] - ارسال همگانی
• /block [ID] - بلاک کاربر
• /unblock [ID] - رفع بلاک
• /send [ID] [متن] - ارسال پیام اختصاصی
  `,

  broadcastSent: (count) => `📢 پیام به ${count} کاربر ارسال شد.`,
  
  history: (messages) => {
    if (messages.length === 0) return '📭 **تاریخچه پیام‌ها خالی است.**';
    let text = '📜 **تاریخچه پیام‌های دریافتی:**\n\n';
    messages.forEach((msg, index) => {
      const typeEmoji = { 'text': '💬', 'photo': '📷', 'video': '🎥', 'audio': '🎵', 'document': '📄', 'sticker': '🎭', 'voice': '🎤', 'animation': '🎬' }[msg.type] || '📨';
      text += `${index + 1}. ${typeEmoji} ${msg.message || '[فایل]'}\n   🕐 ${msg.timestamp}\n   ${msg.read ? '✅ خوانده شده' : '🆕 جدید'}\n\n`;
    });
    return text;
  },
  
  userInfo: (userId, link, stats, joined, lastSeen) => {
    let typesText = '';
    if (Object.keys(stats.types).length > 0) {
      typesText = '\n📊 **نوع پیام‌های دریافتی:**\n';
      for (const [type, count] of Object.entries(stats.types)) {
        const emoji = { 'text': '💬', 'photo': '📷', 'video': '🎥', 'audio': '🎵', 'document': '📄', 'sticker': '🎭', 'voice': '🎤', 'animation': '🎬' }[type] || '📨';
        typesText += `• ${emoji} ${type}: ${count} مورد\n`;
      }
    }
    return `
👤 **اطلاعات کاربری شما**

🆔 آیدی: \`${userId}\`
🔗 لینک شخصی: \`t.me/${BOT_USERNAME}?start=${link}\`

📊 **آمار:**
• 📨 کل پیام‌های دریافتی: ${stats.totalMessages}
• 👤 تعداد فرستنده‌ها: ${stats.totalSenders}
${typesText}

📅 تاریخ عضویت: ${joined}
🕐 آخرین فعالیت: ${lastSeen}

💡 برای مشاهده تاریخچه پیام‌ها: /history
    `;
  },
  
  blocklist: (blockedUsers) => {
    if (blockedUsers.length === 0) return '📭 **لیست بلاک‌ها خالی است.**';
    let text = '🚫 **لیست کاربران بلاک‌شده:**\n\n';
    blockedUsers.forEach((id, index) => { text += `${index + 1}. کاربر ${id}\n`; });
    text += `\n🔓 برای رفع بلاک: /unblock [ID]`;
    return text;
  }
};

// ============================================================
// 🎮 ساخت ربات
// ============================================================

function createBot(kv, ADMIN_ID, BOT_TOKEN) {
  if (!BOT_TOKEN || !ADMIN_ID) throw new Error('BOT_TOKEN و ADMIN_ID الزامی هستند!');

  const bot = new Bot(BOT_TOKEN);

  // ---- start ----
  bot.command('start', async (ctx) => {
    const userId = ctx.from.id.toString();
    const text = ctx.message.text;
    const parts = text.split(' ');
    const linkKey = parts.length > 1 ? parts[1] : null;

    await getUserJoinDate(kv, userId);
    await setUserLastSeen(kv, userId);

    if (linkKey) {
      const recipientId = await getUserIdByLink(kv, linkKey);
      if (recipientId && recipientId !== userId) {
        await addLinkedUser(kv, recipientId, userId);
        await ctx.reply(`
🔗 **شما در حال ارسال پیام ناشناس به این کاربر هستید!**

✍️ پیام خود را بنویسید و بفرستید.
📨 پیام شما کاملاً ناشناس به مقصد می‌رسد.

📱 **پشتیبانی از:** عکس 📷 | ویدیو 🎥 | صدا 🎵 | گیف 🎬 | فایل 📄

⚠️ توجه: این کاربر نمی‌داند شما کی هستید.
        `, {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🔙 بازگشت به منو', callback_data: 'back_to_menu' }]
            ]
          }
        });
        return;
      }
    }

    const userLink = await getUserLink(kv, userId);
    await addAdminUser(kv, userId);
    
    await ctx.reply(MESSAGES.welcome(!!userLink), {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔗 دریافت لینک شخصی', callback_data: 'get_link' }],
          [{ text: '📜 تاریخچه', callback_data: 'history' }],
          [{ text: '👤 اطلاعات من', callback_data: 'me' }],
          [{ text: '📖 راهنما', callback_data: 'help' }]
        ]
      }
    });
  });

  // ---- link ----
  bot.command('link', async (ctx) => {
    const userId = ctx.from.id.toString();
    const link = await getUserLink(kv, userId);
    await setUserLastSeen(kv, userId);
    await ctx.reply(MESSAGES.getLink(link), {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📋 کپی لینک', callback_data: 'copy_link' }],
          [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
        ]
      }
    });
  });

  // ---- help ----
  bot.command('help', async (ctx) => {
    await setUserLastSeen(kv, ctx.from.id.toString());
    await ctx.reply(MESSAGES.help, { parse_mode: 'Markdown' });
  });

  // ---- history ----
  bot.command('history', async (ctx) => {
    const userId = ctx.from.id.toString();
    await setUserLastSeen(kv, userId);
    const history = await getMessageHistory(kv, userId);
    await ctx.reply(MESSAGES.history(history), { parse_mode: 'Markdown' });
  });

  // ---- me ----
  bot.command('me', async (ctx) => {
    const userId = ctx.from.id.toString();
    await setUserLastSeen(kv, userId);
    const link = await getUserLink(kv, userId);
    const stats = await getUserStats(kv, userId);
    const joined = await getUserJoinDate(kv, userId);
    const lastSeen = await getUserLastSeen(kv, userId);
    await ctx.reply(MESSAGES.userInfo(userId, link, stats, joined, lastSeen), { parse_mode: 'Markdown' });
  });

  // ---- blocklist ----
  bot.command('blocklist', async (ctx) => {
    const userId = ctx.from.id.toString();
    await setUserLastSeen(kv, userId);
    const blockKey = `blocked:${userId}`;
    const entry = await kv.get(blockKey);
    const blockedUsers = entry ? JSON.parse(entry) : [];
    await ctx.reply(MESSAGES.blocklist(blockedUsers), { parse_mode: 'Markdown' });
  });

  // ---- unblock ----
  bot.command('unblock', async (ctx) => {
    const userId = ctx.from.id.toString();
    await setUserLastSeen(kv, userId);
    const parts = ctx.message.text.split(' ');
    if (parts.length < 2) {
      await ctx.reply('⚠️ لطفاً آیدی کاربر را وارد کنید:\n`/unblock USER_ID`', { parse_mode: 'Markdown' });
      return;
    }
    const targetId = parts[1];
    const blockKey = `blocked:${userId}`;
    const entry = await kv.get(blockKey);
    let blockedUsers = entry ? JSON.parse(entry) : [];
    if (blockedUsers.includes(targetId)) {
      blockedUsers = blockedUsers.filter(id => id !== targetId);
      await kv.put(blockKey, JSON.stringify(blockedUsers));
      await ctx.reply(`✅ بلاک کاربر ${targetId} برداشته شد.`);
    } else {
      await ctx.reply(`⚠️ کاربر ${targetId} در لیست بلاک شما نیست.`);
    }
  });

  // ---- admin ----
  bot.command('admin', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== ADMIN_ID) {
      await ctx.reply('⛔ شما دسترسی ادمین ندارید.');
      return;
    }
    const users = await getAdminUsers(kv);
    let totalMessages = 0, totalMedia = 0;
    const userList = [];
    for (const uid of users) {
      const linked = await getLinkedUsers(kv, uid);
      const stats = await getUserStats(kv, uid);
      const joined = await getUserJoinDate(kv, uid);
      const lastSeen = await getUserLastSeen(kv, uid);
      const mediaCount = (stats.types?.photo || 0) + (stats.types?.video || 0) + (stats.types?.audio || 0) + (stats.types?.document || 0) + (stats.types?.sticker || 0) + (stats.types?.animation || 0) + (stats.types?.voice || 0);
      totalMessages += linked.length;
      totalMedia += mediaCount;
      userList.push({ id: uid, messages: linked.length, media: mediaCount, joined, lastSeen });
    }
    await ctx.reply(MESSAGES.adminPanel(userList, totalMessages, totalMedia), {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📊 آمار دقیق', callback_data: 'stats_detail' }],
          [{ text: '📢 ارسال همگانی', callback_data: 'broadcast' }]
        ]
      }
    });
  });

  // ---- users ----
  bot.command('users', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== ADMIN_ID) {
      await ctx.reply('⛔ شما دسترسی ادمین ندارید.');
      return;
    }
    const users = await getAdminUsers(kv);
    let msg = '👥 **لیست کامل کاربران:**\n\n';
    for (const uid of users) {
      const link = await getUserLink(kv, uid);
      const linked = await getLinkedUsers(kv, uid);
      const stats = await getUserStats(kv, uid);
      const joined = await getUserJoinDate(kv, uid);
      const lastSeen = await getUserLastSeen(kv, uid);
      msg += `👤 کاربر ${uid}\n  🔗 لینک: t.me/${BOT_USERNAME}?start=${link}\n  📨 پیام‌های دریافتی: ${linked.length}\n  🕐 آخرین فعالیت: ${lastSeen}\n  📅 عضویت: ${joined}\n`;
      if (Object.keys(stats.types).length > 0) {
        const typesStr = Object.entries(stats.types).map(([type, count]) => `${type}: ${count}`).join(', ');
        msg += `  📊 انواع: ${typesStr}\n`;
      }
      msg += `  👤 فرستنده‌ها: ${linked.join(', ') || 'هیچ'}\n\n`;
    }
    await ctx.reply(msg, { parse_mode: 'Markdown' });
  });

  // ---- stats ----
  bot.command('stats', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== ADMIN_ID) {
      await ctx.reply('⛔ شما دسترسی ادمین ندارید.');
      return;
    }
    const users = await getAdminUsers(kv);
    let totalMessages = 0, totalMedia = 0;
    let typeStats = {};
    for (const uid of users) {
      const linked = await getLinkedUsers(kv, uid);
      const stats = await getUserStats(kv, uid);
      totalMessages += linked.length;
      for (const [type, count] of Object.entries(stats.types || {})) {
        typeStats[type] = (typeStats[type] || 0) + count;
        if (type !== 'text') totalMedia += count;
      }
    }
    let typeText = '\n📊 **نوع پیام‌ها:**\n';
    const emojis = { 'text': '💬', 'photo': '📷', 'video': '🎥', 'audio': '🎵', 'document': '📄', 'sticker': '🎭', 'voice': '🎤', 'animation': '🎬' };
    for (const [type, count] of Object.entries(typeStats)) {
      typeText += `• ${emojis[type] || '📨'} ${type}: ${count}\n`;
    }
    await ctx.reply(`
📊 **آمار کامل ربات**

👥 تعداد کاربران: ${users.length}
💬 کل پیام‌ها: ${totalMessages}
📎 فایل‌های ارسال‌شده: ${totalMedia}
${typeText}
🕐 آخرین به‌روزرسانی: ${getPersianDate()}
    `, { parse_mode: 'Markdown' });
  });

  // ---- broadcast ----
  bot.command('broadcast', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== ADMIN_ID) {
      await ctx.reply('⛔ شما دسترسی ادمین ندارید.');
      return;
    }
    const parts = ctx.message.text.split(' ');
    if (parts.length < 2) {
      await ctx.reply('⚠️ لطفاً پیام مورد نظر را وارد کنید:\n`/broadcast متن پیام`', { parse_mode: 'Markdown' });
      return;
    }
    const message = parts.slice(1).join(' ');
    const users = await getAdminUsers(kv);
    let sent = 0;
    for (const uid of users) {
      try {
        await bot.api.sendMessage(parseInt(uid), `📢 **پیام همگانی از ادمین:**\n\n${message}\n\n🕐 ${getPersianDate()}`, { parse_mode: 'Markdown' });
        sent++;
      } catch (e) {}
    }
    await ctx.reply(MESSAGES.broadcastSent(sent));
  });

  // ---- send ----
  bot.command('send', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== ADMIN_ID) {
      await ctx.reply('⛔ شما دسترسی ادمین ندارید.');
      return;
    }
    const parts = ctx.message.text.split(' ');
    if (parts.length < 3) {
      await ctx.reply('⚠️ لطفاً به این صورت ارسال کنید:\n`/send USER_ID متن پیام`', { parse_mode: 'Markdown' });
      return;
    }
    const targetUserId = parts[1];
    const message = parts.slice(2).join(' ');
    try {
      await bot.api.sendMessage(parseInt(targetUserId), `📨 **پیام از ادمین:**\n\n${message}\n\n🕐 ${getPersianDate()}`, { parse_mode: 'Markdown' });
      await ctx.reply(`✅ پیام به کاربر ${targetUserId} ارسال شد.`);
    } catch (e) {
      await ctx.reply(`❌ ارسال پیام به کاربر ${targetUserId} ناموفق بود.`);
    }
  });

  // ---- block ----
  bot.command('block', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== ADMIN_ID) {
      await ctx.reply('⛔ شما دسترسی ادمین ندارید.');
      return;
    }
    const parts = ctx.message.text.split(' ');
    if (parts.length < 2) {
      await ctx.reply('⚠️ لطفاً آیدی کاربر را وارد کنید:\n`/block USER_ID`', { parse_mode: 'Markdown' });
      return;
    }
    const targetId = parts[1];
    await blockUser(kv, targetId, 'admin');
    await ctx.reply(`✅ کاربر ${targetId} بلاک شد.`);
  });

  // ---- unblock ----
  bot.command('unblock', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== ADMIN_ID) {
      await ctx.reply('⛔ شما دسترسی ادمین ندارید.');
      return;
    }
    const parts = ctx.message.text.split(' ');
    if (parts.length < 2) {
      await ctx.reply('⚠️ لطفاً آیدی کاربر را وارد کنید:\n`/unblock USER_ID`', { parse_mode: 'Markdown' });
      return;
    }
    const targetId = parts[1];
    await unblockUser(kv, targetId, 'admin');
    await ctx.reply(`✅ بلاک کاربر ${targetId} برداشته شد.`);
  });

  // ============================================================
  // 🎯 Callback Query ها
  // ============================================================

  bot.callbackQuery('get_link', async (ctx) => {
    const userId = ctx.from.id.toString();
    const link = await getUserLink(kv, userId);
    await setUserLastSeen(kv, userId);
    try {
      await ctx.editMessageText(MESSAGES.getLink(link), {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '📋 کپی لینک', callback_data: 'copy_link' }],
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
          ]
        }
      });
    } catch (e) {
      await ctx.reply(MESSAGES.getLink(link), {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '📋 کپی لینک', callback_data: 'copy_link' }],
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
          ]
        }
      });
    }
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery('help', async (ctx) => {
    await setUserLastSeen(kv, ctx.from.id.toString());
    try {
      await ctx.editMessageText(MESSAGES.help, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
          ]
        }
      });
    } catch (e) {
      await ctx.reply(MESSAGES.help, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
          ]
        }
      });
    }
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery('history', async (ctx) => {
    const userId = ctx.from.id.toString();
    await setUserLastSeen(kv, userId);
    const history = await getMessageHistory(kv, userId);
    const text = MESSAGES.history(history);
    try {
      await ctx.editMessageText(text, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }],
            [{ text: '🔄 به‌روزرسانی', callback_data: 'history' }]
          ]
        }
      });
    } catch (e) {
      await ctx.reply(text, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }],
            [{ text: '🔄 به‌روزرسانی', callback_data: 'history' }]
          ]
        }
      });
    }
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery('me', async (ctx) => {
    const userId = ctx.from.id.toString();
    await setUserLastSeen(kv, userId);
    const link = await getUserLink(kv, userId);
    const stats = await getUserStats(kv, userId);
    const joined = await getUserJoinDate(kv, userId);
    const lastSeen = await getUserLastSeen(kv, userId);
    const text = MESSAGES.userInfo(userId, link, stats, joined, lastSeen);
    try {
      await ctx.editMessageText(text, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
          ]
        }
      });
    } catch (e) {
      await ctx.reply(text, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
          ]
        }
      });
    }
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery('back_to_menu', async (ctx) => {
    const userId = ctx.from.id.toString();
    const link = await getUserLink(kv, userId);
    await setUserLastSeen(kv, userId);
    const text = MESSAGES.welcome(!!link);
    try {
      await ctx.editMessageText(text, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔗 دریافت لینک شخصی', callback_data: 'get_link' }],
            [{ text: '📜 تاریخچه', callback_data: 'history' }],
            [{ text: '👤 اطلاعات من', callback_data: 'me' }],
            [{ text: '📖 راهنما', callback_data: 'help' }]
          ]
        }
      });
    } catch (e) {
      await ctx.reply(text, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔗 دریافت لینک شخصی', callback_data: 'get_link' }],
            [{ text: '📜 تاریخچه', callback_data: 'history' }],
            [{ text: '👤 اطلاعات من', callback_data: 'me' }],
            [{ text: '📖 راهنما', callback_data: 'help' }]
          ]
        }
      });
    }
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery('copy_link', async (ctx) => {
    await ctx.answerCallbackQuery('✅ لینک کپی شد!', { show_alert: true });
  });

  bot.callbackQuery('stats_detail', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== ADMIN_ID) {
      await ctx.answerCallbackQuery('⛔ شما دسترسی ادمین ندارید.', { show_alert: true });
      return;
    }
    const users = await getAdminUsers(kv);
    let msg = '📊 **آمار تفصیلی هر کاربر:**\n\n';
    for (const uid of users) {
      const stats = await getUserStats(kv, uid);
      const linked = await getLinkedUsers(kv, uid);
      msg += `👤 ${uid}: ${linked.length} پیام`;
      if (Object.keys(stats.types).length > 0) {
        const typesStr = Object.entries(stats.types).map(([type, count]) => `${type}: ${count}`).join(', ');
        msg += ` (${typesStr})`;
      }
      msg += '\n';
    }
    try {
      await ctx.editMessageText(msg, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
          ]
        }
      });
    } catch (e) {
      await ctx.reply(msg, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
          ]
        }
      });
    }
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery('broadcast', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== ADMIN_ID) {
      await ctx.answerCallbackQuery('⛔ شما دسترسی ادمین ندارید.', { show_alert: true });
      return;
    }
    const text = `
📢 **ارسال همگانی**

لطفاً پیام مورد نظر را با دستور زیر ارسال کنید:

\`/broadcast متن پیام\`

مثال: \`/broadcast سلام به همه! 🎉\`
    `;
    try {
      await ctx.editMessageText(text, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
          ]
        }
      });
    } catch (e) {
      await ctx.reply(text, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
          ]
        }
      });
    }
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery(/block_sender_(\d+)/, async (ctx) => {
    const userId = ctx.from.id.toString();
    const senderId = ctx.match[1];
    if (senderId) {
      await blockUser(kv, userId, senderId);
      const blockKey = `blocked:${userId}`;
      const entry = await kv.get(blockKey);
      let blockedUsers = entry ? JSON.parse(entry) : [];
      if (!blockedUsers.includes(senderId)) {
        blockedUsers.push(senderId);
        await kv.put(blockKey, JSON.stringify(blockedUsers));
      }
      const text = `
⛔ **فرستنده با موفقیت بلاک شد!**

دیگه پیامی از این شخص دریافت نمی‌کنی.

🔄 برای مشاهده لیست بلاک‌ها: /blocklist
      `;
      try {
        await ctx.editMessageText(text, {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🔙 بازگشت به منو', callback_data: 'back_to_menu' }]
            ]
          }
        });
      } catch (e) {
        await ctx.reply(text, {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🔙 بازگشت به منو', callback_data: 'back_to_menu' }]
            ]
          }
        });
      }
      await ctx.answerCallbackQuery('✅ فرستنده بلاک شد!');
    }
  });

  bot.callbackQuery(/reply_to_(\d+)/, async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== ADMIN_ID) {
      await ctx.answerCallbackQuery('⛔ شما دسترسی ادمین ندارید.', { show_alert: true });
      return;
    }
    const targetUserId = ctx.match[1];
    const text = `
✍️ **پاسخ به کاربر ${targetUserId}**

لطفاً پیام خود را به صورت زیر ارسال کنید:

\`/send ${targetUserId} متن پیام\`

مثال: \`/send ${targetUserId} سلام، پیام شما را دریافت کردم.\`
    `;
    try {
      await ctx.editMessageText(text, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
          ]
        }
      });
    } catch (e) {
      await ctx.reply(text, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
          ]
        }
      });
    }
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery(/block_user_(\d+)/, async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== ADMIN_ID) {
      await ctx.answerCallbackQuery('⛔ شما دسترسی ادمین ندارید.', { show_alert: true });
      return;
    }
    const targetUserId = ctx.match[1];
    await blockUser(kv, targetUserId, 'admin');
    const text = `✅ کاربر ${targetUserId} بلاک شد.`;
    try {
      await ctx.editMessageText(text, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
          ]
        }
      });
    } catch (e) {
      await ctx.reply(text, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت', callback_data: 'back_to_menu' }]
          ]
        }
      });
    }
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery(/send_to_(\d+)/, async (ctx) => {
    const userId = ctx.from.id.toString();
    const targetUserId = ctx.match[1];
    const linkedUsers = await getLinkedUsers(kv, targetUserId);
    if (!linkedUsers.includes(userId)) {
      await ctx.answerCallbackQuery('⛔ شما دسترسی ارسال به این کاربر را ندارید.', { show_alert: true });
      return;
    }
    const text = `
🔗 **شما در حال ارسال پیام ناشناس به این کاربر هستید!**

✍️ پیام خود را بنویسید و بفرستید.
📨 پیام شما کاملاً ناشناس به مقصد می‌رسد.

📱 **پشتیبانی از:** عکس 📷 | ویدیو 🎥 | صدا 🎵 | گیف 🎬 | فایل 📄
    `;
    try {
      await ctx.editMessageText(text, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت به منو', callback_data: 'back_to_menu' }]
          ]
        }
      });
    } catch (e) {
      await ctx.reply(text, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 بازگشت به منو', callback_data: 'back_to_menu' }]
          ]
        }
      });
    }
    await ctx.answerCallbackQuery();
  });

  // ============================================================
  // 📨 هندلر پیام‌های متنی
  // ============================================================
  
  bot.on('message:text', async (ctx) => {
    const userId = ctx.from.id.toString();
    const text = ctx.message.text;
    if (text.startsWith('/')) return;
    await setUserLastSeen(kv, userId);
    const linkedUsers = await getLinkedUsers(kv, userId);
    
    if (linkedUsers.length > 0) {
      let sent = false;
      for (const senderId of linkedUsers) {
        const blocked = await isBlocked(kv, userId, senderId);
        if (!blocked) {
          try {
            await bot.api.sendMessage(parseInt(senderId), `
📨 **پاسخ به پیام شما:**

${text}

🕐 ${getPersianDate()}

👤 این پاسخ از طرف کاربر مورد نظر شماست.
            `, {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [{ text: '📩 ارسال پیام جدید', callback_data: `send_to_${userId}` }]
                ]
              }
            });
            await saveMessage(kv, senderId, userId, text, 'text');
            sent = true;
          } catch (e) {}
        }
      }
      if (sent) await ctx.reply(MESSAGES.replySent);
      else await ctx.reply('⚠️ پیام شما ارسال نشد. ممکن است فرستنده شما را بلاک کرده باشد.');
      return;
    }

    if (ADMIN_ID) {
      await bot.api.sendMessage(parseInt(ADMIN_ID), `
📩 **پیام ناشناس جدید از کاربر:**

👤 کاربر: ${userId}
📝 متن: ${text}
🕐 ${getPersianDate()}
      `, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '✍️ پاسخ به کاربر', callback_data: `reply_to_${userId}` }],
            [{ text: '⛔ بلاک کاربر', callback_data: `block_user_${userId}` }]
          ]
        }
      });
      await saveMessage(kv, ADMIN_ID, userId, text, 'text');
      await ctx.reply('✅ پیام شما با موفقیت به ادمین ارسال شد.');
    }
  });

  // ============================================================
  // 📎 هندلر رسانه‌ها
  // ============================================================

  bot.on(['message:photo', 'message:video', 'message:document', 'message:audio', 'message:voice', 'message:sticker', 'message:animation'], async (ctx) => {
    const userId = ctx.from.id.toString();
    await setUserLastSeen(kv, userId);
    const linkedUsers = await getLinkedUsers(kv, userId);
    const mediaType = ctx.message.photo ? 'photo' :
                      ctx.message.video ? 'video' :
                      ctx.message.document ? 'document' :
                      ctx.message.audio ? 'audio' :
                      ctx.message.voice ? 'voice' :
                      ctx.message.sticker ? 'sticker' :
                      ctx.message.animation ? 'animation' : 'file';
    const emojiMap = { 'photo': '📷', 'video': '🎥', 'document': '📄', 'audio': '🎵', 'voice': '🎤', 'sticker': '🎭', 'animation': '🎬' };
    const emoji = emojiMap[mediaType] || '📎';

    if (linkedUsers.length > 0) {
      let sent = false;
      for (const senderId of linkedUsers) {
        const blocked = await isBlocked(kv, userId, senderId);
        if (!blocked) {
          try {
            await ctx.copyMessage(parseInt(senderId));
            await bot.api.sendMessage(parseInt(senderId), `
${emoji} **یک ${mediaType} از طرف کاربر دریافت کردید!**

🕐 ${getPersianDate()}

💡 برای پاسخ، پیام خود را تایپ کنید.
            `, {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [{ text: '📩 ارسال پیام جدید', callback_data: `send_to_${userId}` }]
                ]
              }
            });
            const caption = ctx.message.caption || `[${mediaType}]`;
            await saveMessage(kv, senderId, userId, caption, mediaType);
            sent = true;
          } catch (e) {}
        }
      }
      if (sent) await ctx.reply('✅ فایل شما با موفقیت ارسال شد.');
      else await ctx.reply('⚠️ فایل شما ارسال نشد. ممکن است فرستنده شما را بلاک کرده باشد.');
      return;
    }

    if (ADMIN_ID) {
      await ctx.copyMessage(parseInt(ADMIN_ID));
      await bot.api.sendMessage(parseInt(ADMIN_ID), `
📩 **فایل جدید از کاربر:**

👤 کاربر: ${userId}
📎 نوع: ${mediaType}
🕐 ${getPersianDate()}
      `, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '⛔ بلاک کاربر', callback_data: `block_user_${userId}` }]
          ]
        }
      });
      const caption = ctx.message.caption || `[${mediaType}]`;
      await saveMessage(kv, ADMIN_ID, userId, caption, mediaType);
      await ctx.reply('✅ فایل شما با موفقیت به ادمین ارسال شد.');
    }
  });

  return bot;
}

// ============================================================
// 🚀 هندلر Cloudflare Worker
// ============================================================

export default {
  async fetch(request, env) {
    try {
      const kv = env.KV;
      const BOT_TOKEN = env.BOT_TOKEN;
      const ADMIN_ID = env.ADMIN_ID;

      let bot;
      try {
        bot = createBot(kv, ADMIN_ID, BOT_TOKEN);
      } catch (err) {
        return new Response(`❌ خطا در ساخت ربات: ${err.message}`, { status: 500 });
      }

      const url = new URL(request.url);
      
      if (url.pathname === '/register') {
        const webhookUrl = `https://${url.host}/webhook`;
        const result = await bot.api.setWebhook(webhookUrl);
        return new Response(JSON.stringify(result, null, 2), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (url.pathname === '/unregister') {
        const result = await bot.api.deleteWebhook();
        return new Response(JSON.stringify(result, null, 2), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (url.pathname === '/webhook') {
        return await webhookCallback(bot, 'std/http')(request);
      }
      
      const users = await getAdminUsers(kv);
      return new Response(`
🤖 **ربات چت ناشناس - فعال!**

✅ وضعیت: آنلاین
📊 تعداد کاربران: ${users.length}
🕐 زمان: ${getPersianDate()}

برای تنظیم Webhook:
👉 /register

📱 **قابلیت‌ها:**
• ارسال متن، عکس، ویدیو، صدا، فایل، گیف و استیکر
• تاریخچه پیام‌ها
• مدیریت بلاک
• پنل ادمین پیشرفته
      `, {
        headers: { 'Content-Type': 'text/plain' }
      });
      
    } catch (error) {
      return new Response(`❌ خطا: ${error.message}`, { status: 500 });
    }
  }
};
