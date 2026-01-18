import mongoose from 'mongoose';

async function checkDatabase() {
  try {
    const mongoUri = 'mongodb+srv://amankumarr2005ak_db_user:MxOJlWNLRDP29ivf@cluster0.ahyiozf.mongodb.net/?appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB connected');

    const db = mongoose.connection.db;
    
    // Check users
    const users = await db.collection('user').find({}).toArray();
    console.log(`✓ Users in database: ${users.length}`);
    if (users.length > 0) {
      users.forEach(u => console.log(`  - ${u.email} (${u.name})`));
    }

    // Check watchlists
    const watchlists = await db.collection('watchlist').find({}).toArray();
    console.log(`✓ Watchlists in database: ${watchlists.length}`);
    if (watchlists.length > 0) {
      watchlists.forEach(w => console.log(`  - User: ${w.userEmail}, Symbols: ${w.symbols?.join(', ') || 'none'}`));
    }

    // Check if there are any migrations or inngest logs
    const collections = await db.listCollections().toArray();
    console.log(`\n✓ Collections in database:`, collections.map(c => c.name).join(', '));

    await mongoose.disconnect();
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
