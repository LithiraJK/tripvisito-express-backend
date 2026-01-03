export const bookingSuccessTemplate = (name: string, trip: string, amount: number) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
    <div style="background-color: #1877F2 color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">Tripvisito</h1>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #1877F2;">Your booking is confirmed!</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Great news! Your payment was successful, and your spot for <strong>${trip}</strong> is officially reserved.</p>
      <div style="background-color: #f8fafc; border-left: 4px solid #1877F2; padding: 15px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Destination:</strong> ${trip}</p>
        <p style="margin: 0;"><strong>Total Paid:</strong> $${amount.toFixed(2)} USD</p>
        <p style="margin: 0;"><strong>Status:</strong> Paid & Confirmed</p>
      </div>
      <p>You can now view your trip details and chat with our guides in your user dashboard.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="http://localhost:5173/customer/dashboard" style="background-color: #1877F2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View My Dashboard</a>
      </div>
    </div>
    <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
      <p style="margin: 0;">© 2026 Tripvisito Travel Agency. All rights reserved.</p>
    </div>
  </div>
`;