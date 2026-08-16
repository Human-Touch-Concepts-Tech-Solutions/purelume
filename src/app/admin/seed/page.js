import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function CreateAdminPage() {
  let resultMessage = '';

  const adminUsername = 'Comfort Falako';
  const rawPassword = 'Comfort@1995.';

  try {
    const client = await clientPromise;
    const db = client.db('purelume');
    const admins = db.collection('admins');

    // Hash with cost factor 10
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Upsert: Create if doesn't exist, update password if it does
    await admins.updateOne(
      { username: adminUsername },
      {
        $set: {
          username: adminUsername,
          password: hashedPassword,
          role: 'superadmin',
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    resultMessage = `Admin credentials successfully updated in MongoDB!\nUsername: ${adminUsername}\nPassword: ${rawPassword}`;

  } catch (error) {
    resultMessage = `Error seeding admin: ${error.message}`;
  }

  return (
    <div style={{ padding: '3rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Admin Seeder & Credential Reset</h2>
      <pre style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px', whiteSpace: 'pre-wrap' }}>
        {resultMessage}
      </pre>
    </div>
  );
}