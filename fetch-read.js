import { SimplePool } from 'nostr-tools';

const AUTHOR_HEX = '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d';
const RELAYS = ['wss://relay.primal.net', 'wss://relay.damus.io', 'wss://nos.lol'];

const pool = new SimplePool();

async function fetchReads() {
  try {
    console.log('Fetching reads from Nostr relays...');
    
    // Query for kind 30023 (long-form articles) from specific author
    const events = await pool.querySync(RELAYS, {
      kinds: [30023],
      authors: [AUTHOR_HEX],
      limit: 50
    });
    
    console.log(`Found ${events.length} reads`);
    
    // Sort by date (newest first)
    events.sort((a, b) => b.created_at - a.created_at);
    
    const output = {
      lastUpdated: Math.floor(Date.now() / 1000),
      data: events
    };
    
    // Write to file
    const fs = await import('fs');
    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync('data/reads.json', JSON.stringify(output, null, 2));
    
    console.log('Successfully saved to data/reads.json');
    
  } catch (error) {
    console.error('Error fetching reads:', error);
    process.exit(1);
  } finally {
    pool.close(RELAYS);
  }
}

fetchReads();
