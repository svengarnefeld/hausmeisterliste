const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // Dein Passwort kommt in die Vercel-Einstellungen
const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        await client.connect();
        const database = client.db('jobcenter');
        const collection = database.collection('auftraege');

        if (req.method === 'GET') {
            // Aufträge aus DB laden
            const orders = await collection.find({}).toArray();
            return res.status(200).json(orders);
        } 

        if (req.method === 'POST') {
            // Bestehende Liste löschen und neue Liste speichern (da du "Alles Speichern" nutzt)
            const newOrders = req.body;
            await collection.deleteMany({}); 
            if (newOrders.length > 0) {
                await collection.insertMany(newOrders);
            }
            return res.status(200).json({ message: 'Gespeichert' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
