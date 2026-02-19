const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { type, details } = req.body;

    try {
        await resend.emails.send({
            from: 'Jobcenter-Liste <onboarding@resend.dev>', // Später eigene Domain
            to: ['hausmeister@deine-behörde.de'], // Empfänger-Adresse
            subject: `Neue Änderung: ${type}`,
            html: `
                <h2>Update an der Auftragsliste</h2>
                <p><strong>Aktion:</strong> ${type}</p>
                <p><strong>Liegenschaft:</strong> ${details.standort}</p>
                <p><strong>Sachverhalt:</strong> ${details.text}</p>
                <p><strong>Status:</strong> ${details.status}</p>
                <br>
                <a href="https://${process.env.VERCEL_URL}">Zur Liste wechseln</a>
            `
        });
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
