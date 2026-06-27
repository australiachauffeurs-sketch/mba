interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

const FROM = `${process.env.EMAIL_FROM_NAME || "UniConnect"} <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return // silently skip — platform works without email configured

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })
  } catch {
    // never crash the main request flow due to email failure
  }
}

// ── Email templates ──────────────────────────────────────────────────────────

export function connectionRequestEmail(senderName: string, platformUrl: string) {
  return {
    subject: `${senderName} wants to connect with you on UniConnect`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1e293b">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
          <div style="width:36px;height:36px;background:#4f46e5;border-radius:8px;display:flex;align-items:center;justify-content:center">
            <span style="color:white;font-size:18px">✦</span>
          </div>
          <span style="font-size:18px;font-weight:700;color:#1e293b">UniConnect</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700">New connection request</h2>
        <p style="margin:0 0 24px;color:#64748b;font-size:15px">
          <strong style="color:#1e293b">${senderName}</strong> wants to connect with you on UniConnect AI.
        </p>
        <a href="${platformUrl}/student/network"
          style="display:inline-block;background:#4f46e5;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">
          View Request
        </a>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0" />
        <p style="color:#94a3b8;font-size:12px;margin:0">
          You received this because you have an account on UniConnect AI.<br>
          <a href="${platformUrl}" style="color:#4f46e5">Visit platform</a>
        </p>
      </div>`,
  }
}

export function connectionAcceptedEmail(acceptorName: string, platformUrl: string) {
  return {
    subject: `${acceptorName} accepted your connection request`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1e293b">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
          <div style="width:36px;height:36px;background:#4f46e5;border-radius:8px;display:flex;align-items:center;justify-content:center">
            <span style="color:white;font-size:18px">✦</span>
          </div>
          <span style="font-size:18px;font-weight:700;color:#1e293b">UniConnect</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700">Connection accepted 🎉</h2>
        <p style="margin:0 0 24px;color:#64748b;font-size:15px">
          <strong style="color:#1e293b">${acceptorName}</strong> accepted your connection request. You can now message each other directly.
        </p>
        <a href="${platformUrl}/student/messages"
          style="display:inline-block;background:#4f46e5;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">
          Send a Message
        </a>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0" />
        <p style="color:#94a3b8;font-size:12px;margin:0">UniConnect AI · <a href="${platformUrl}" style="color:#4f46e5">Visit platform</a></p>
      </div>`,
  }
}

export function newMessageEmail(senderName: string, preview: string, platformUrl: string) {
  return {
    subject: `New message from ${senderName} on UniConnect`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1e293b">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
          <div style="width:36px;height:36px;background:#4f46e5;border-radius:8px;display:flex;align-items:center;justify-content:center">
            <span style="color:white;font-size:18px">✦</span>
          </div>
          <span style="font-size:18px;font-weight:700;color:#1e293b">UniConnect</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700">New message</h2>
        <p style="margin:0 0 16px;color:#64748b;font-size:15px">
          <strong style="color:#1e293b">${senderName}</strong> sent you a message:
        </p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin-bottom:24px;color:#475569;font-size:14px;font-style:italic">
          "${preview.length > 200 ? preview.slice(0, 200) + "…" : preview}"
        </div>
        <a href="${platformUrl}/student/messages"
          style="display:inline-block;background:#4f46e5;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">
          Reply
        </a>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0" />
        <p style="color:#94a3b8;font-size:12px;margin:0">UniConnect AI · <a href="${platformUrl}" style="color:#4f46e5">Visit platform</a></p>
      </div>`,
  }
}

export function mentorRequestEmail(menteeName: string, topic: string, platformUrl: string) {
  return {
    subject: `${menteeName} requested a mentoring session on UniConnect`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1e293b">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
          <div style="width:36px;height:36px;background:#4f46e5;border-radius:8px;display:flex;align-items:center;justify-content:center">
            <span style="color:white;font-size:18px">✦</span>
          </div>
          <span style="font-size:18px;font-weight:700;color:#1e293b">UniConnect</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700">New mentoring request</h2>
        <p style="margin:0 0 8px;color:#64748b;font-size:15px">
          <strong style="color:#1e293b">${menteeName}</strong> has requested a mentoring session with you.
        </p>
        ${topic ? `<p style="margin:0 0 24px;color:#64748b;font-size:14px">Topic: <em>${topic}</em></p>` : ""}
        <a href="${platformUrl}/alumni/mentoring"
          style="display:inline-block;background:#4f46e5;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">
          Review Request
        </a>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0" />
        <p style="color:#94a3b8;font-size:12px;margin:0">UniConnect AI · <a href="${platformUrl}" style="color:#4f46e5">Visit platform</a></p>
      </div>`,
  }
}
