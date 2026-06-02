import { NextRequest, NextResponse } from "next/server"

// SMS_TEST_MODE=true => only simulate SMS sending
// SMS_TEST_MODE=false => send real SMS through Kavenegar
const IS_TEST_MODE = process.env.SMS_TEST_MODE === "true"

function normalizePhone(phone: string) {
  const cleaned = phone.trim().replace(/[\s-]/g, "")
  if (cleaned.startsWith("+98")) return `0${cleaned.slice(3)}`
  if (cleaned.startsWith("98") && cleaned.length === 12) return `0${cleaned.slice(2)}`
  return cleaned
}

function buildError(status: number, details?: string, data?: unknown) {
  const errorMessages: Record<number, string> = {
    400: "پارامترها ناقص هستند",
    401: "حساب کاربری غیرفعال است",
    402: "عملیات ناموفق بود",
    403: "کد API نامعتبر است",
    404: "روش نامشخص است",
    406: "پارامترهای اجباری خالی است",
    411: "گیرنده نامعتبر است",
    412: "فرستنده نامعتبر است؛ باید خط ارسال معتبر پنل کاوه‌نگار را در KAVENEGAR_SENDER بگذارید یا از VERIFY_LOOKUP با قالب تأییدشده استفاده کنید.",
    413: "پیام خالی است یا طول پیام بیش از حد مجاز است",
    418: "اعتبار شما کافی نمی‌باشد",
  }

  return {
    error: errorMessages[status] || details || "خطا در ارسال پیامک",
    status,
    details,
    data,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { receptor, message, testMode } = await request.json()

    const apiKey = process.env.KAVENEGAR_API_KEY
    const sender = (process.env.KAVENEGAR_SENDER || "").trim()
    const method = (process.env.SMS_METHOD || "send").trim().toLowerCase()
    const verifyTemplate = (process.env.KAVENEGAR_VERIFY_TEMPLATE || "").trim()
    const defaultReceptor = process.env.DEFAULT_SMS_RECEPTOR || "09934943645"
    const finalReceptor = normalizePhone(receptor || defaultReceptor)
    const finalMessage = String(message || "").trim()

    if (!finalMessage) {
      return NextResponse.json(
        { error: "متن پیام وارد نشده است", details: "message is required" },
        { status: 400 }
      )
    }

    if (!apiKey && !IS_TEST_MODE && !testMode) {
      return NextResponse.json(
        {
          error: "کلید API کاوه‌نگار تنظیم نشده است",
          details: "KAVENEGAR_API_KEY را داخل فایل .env.local یا تنظیمات Vercel قرار دهید.",
        },
        { status: 500 }
      )
    }

    if (IS_TEST_MODE || testMode) {
      await new Promise((resolve) => setTimeout(resolve, 800))

      return NextResponse.json({
        success: true,
        message: "پیامک با موفقیت ارسال شد (حالت تست)",
        simulated: true,
        note: "SMS_TEST_MODE فعال است؛ برای ارسال واقعی مقدار آن را false کنید.",
        data: {
          return: { status: 200, message: "تست موفق" },
          entries: [
            {
              messageid: Date.now(),
              receptor: finalReceptor,
              sender: sender || "verify/lookup یا خط پیش‌فرض پنل",
              message: finalMessage.substring(0, 50) + (finalMessage.length > 50 ? "..." : ""),
              status: 1,
              statustext: "حالت تست",
            },
          ],
        },
      })
    }

    // Recommended when your Kavenegar account has no valid sender line:
    // Create/approve a template in Kavenegar, then set SMS_METHOD=verify and KAVENEGAR_VERIFY_TEMPLATE=your_template_name
    if (method === "verify" || method === "lookup") {
      if (!verifyTemplate) {
        return NextResponse.json(
          {
            error: "نام قالب Verify کاوه‌نگار تنظیم نشده است",
            details: "برای استفاده بدون خط ارسال، در .env.local مقدار KAVENEGAR_VERIFY_TEMPLATE را برابر نام قالب تأییدشده پنل بگذارید.",
          },
          { status: 400 }
        )
      }

      const verifyUrl = `https://api.kavenegar.com/v1/${encodeURIComponent(apiKey!)}/verify/lookup.json`
      const params = new URLSearchParams({
        receptor: finalReceptor,
        token: finalMessage.slice(0, 100),
        template: verifyTemplate,
      })

      const response = await fetch(`${verifyUrl}?${params.toString()}`, {
        method: "GET",
        signal: AbortSignal.timeout(10000),
      })

      const data = await response.json().catch(async () => ({ raw: await response.text() }))

      if (data.return?.status === 200) {
        return NextResponse.json({
          success: true,
          message: "پیامک با موفقیت از طریق Verify/Lookup ارسال شد",
          simulated: false,
          method: "verify/lookup",
          data,
        })
      }

      const status = data.return?.status || response.status || 500
      return NextResponse.json(buildError(status, data.return?.message, data), { status: 400 })
    }

    // Normal sms/send requires a sender line on many Kavenegar accounts.
    // If you get status 412, copy your valid sender line from the Kavenegar panel into KAVENEGAR_SENDER.
    if (!sender) {
      return NextResponse.json(
        {
          error: "خط ارسال کاوه‌نگار تنظیم نشده است",
          details: "برای sms/send باید مقدار KAVENEGAR_SENDER را برابر خط ارسال معتبر پنل بگذارید. اگر خط ندارید، SMS_METHOD=verify و KAVENEGAR_VERIFY_TEMPLATE را تنظیم کنید.",
        },
        { status: 400 }
      )
    }

    const sendUrl = `https://api.kavenegar.com/v1/${encodeURIComponent(apiKey!)}/sms/send.json`
    const params = new URLSearchParams({
      receptor: finalReceptor,
      sender,
      message: finalMessage,
    })

    const response = await fetch(`${sendUrl}?${params.toString()}`, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
    })

    const data = await response.json().catch(async () => ({ raw: await response.text() }))

    if (data.return?.status === 200) {
      return NextResponse.json({
        success: true,
        message: "پیامک با موفقیت ارسال شد",
        simulated: false,
        method: "sms/send",
        data,
      })
    }

    const status = data.return?.status || response.status || 500
    return NextResponse.json(buildError(status, data.return?.message, data), { status: 400 })
  } catch (error) {
    return NextResponse.json(
      { error: "خطا در اتصال به سرور کاوه‌نگار", details: String(error) },
      { status: 500 }
    )
  }
}
