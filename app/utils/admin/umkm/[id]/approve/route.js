// app/api/admin/umkm/[id]/approve/route.js
import { NextResponse } from "next/server";
import { sendEmail } from "@/utils/email";
import prisma from "@/lib/prisma"; // Sesuaikan dengan setup prisma Anda

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { alasan, email, nama_umkm } = body;

    // Validasi input
    if (!email || !nama_umkm) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Update status UMKM di database
    await prisma.umkm.update({
      where: { id_umkm: parseInt(id) },
      data: { status_verifikasi: "Approved" }
    });

    // Kirim email notifikasi
    const emailSubject = `Persetujuan UMKM - ${nama_umkm}`;
    const emailText = `
Selamat! UMKM Anda "${nama_umkm}" telah disetujui.

${alasan || "UMKM Anda telah memenuhi persyaratan dan disetujui oleh admin."}

Terima kasih telah mendaftar.

Salam,
Tim Admin
    `;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .message-box { background-color: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    .button { display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">✅ UMKM Disetujui</h1>
    </div>
    <div class="content">
      <h2>Selamat!</h2>
      <p>UMKM Anda <strong>"${nama_umkm}"</strong> telah disetujui oleh admin.</p>
      
      ${
        alasan
          ? `
      <div class="message-box">
        <h3 style="margin-top: 0; color: #10b981;">Pesan dari Admin:</h3>
        <p style="white-space: pre-wrap;">${alasan}</p>
      </div>
      `
          : ""
      }
      
      <p>UMKM Anda sekarang sudah aktif dan dapat melakukan transaksi.</p>
      
      <p>Terima kasih telah mendaftar dan bergabung dengan kami!</p>
    </div>
    <div class="footer">
      <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
      <p>&copy; ${new Date().getFullYear()} Sistem Manajemen UMKM</p>
    </div>
  </div>
</body>
</html>
    `;

    try {
      await sendEmail({
        to: email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Tetap return success karena status sudah diupdate
      // tapi beri warning bahwa email gagal
      return NextResponse.json({
        success: true,
        message: "UMKM disetujui, tetapi email gagal dikirim",
        emailSent: false
      });
    }

    return NextResponse.json({
      success: true,
      message: "UMKM berhasil disetujui dan email notifikasi telah dikirim",
      emailSent: true
    });
  } catch (error) {
    console.error("Error approving UMKM:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal menyetujui UMKM"
      },
      { status: 500 }
    );
  }
}
