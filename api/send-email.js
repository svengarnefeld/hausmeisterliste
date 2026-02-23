const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { type, details } = req.body;
    
    // Deine gewünschten Empfänger
    const recipients = [
        'JCBonn.Organisation@gmx.de'

    ];

    // Betreff-Logik: [Typ] Liegenschaft | Raum
    const subject = `[${type}] ${details.standort} | ${details.raum || 'Kein Raum'}`;

    try {
        await resend.emails.send({
            from: 'Jobcenter-Bonn <onboarding@resend.dev>', // Sobald Domain verifiziert, hier anpassen
            to: recipients,
            subject: subject,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h2 style="color: #00a5d1;">Update an der Auftragsliste</h2>
                    <p>Es gibt eine Aktualisierung für folgendes Objekt:</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 5px; font-weight: bold;">Art:</td><td>${type}</td></tr>
                        <tr><td style="padding: 5px; font-weight: bold;">Liegenschaft:</td><td>${details.standort}</td></tr>
                        <tr><td style="padding: 5px; font-weight: bold;">Raum:</td><td>${details.raum || '-'}</td></tr>
                        <tr><td style="padding: 5px; font-weight: bold;">Sachverhalt:</td><td>${details.text}</td></tr>
                        <tr><td style="padding: 5px; font-weight: bold;">Status:</td><td><span style="background: #eee; padding: 2px 8px; border-radius: 10px;">${details.status.toUpperCase()}</span></td></tr>
                        <tr><td style="padding: 5px; font-weight: bold;">Anmerkung:</td><td>${details.note || '-'}</td></tr>
                        <tr><td style="padding: 5px; font-weight: bold;">Veranlasser:</td><td>${details.name}</td></tr>
                    </table>
                    <br>
                    <hr style="border: 0; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #999;">Diese Mail wurde automatisch vom Jobcenter Auftrags-System versendet.</p>
                </div>
            `
        });
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
