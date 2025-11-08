// Test script for the order completion API
// Run this in your browser console or as a Node.js script

const testOrderCompletion = async () => {
  const orderId = "your-order-id-here"; // Replace with actual order ID
  const adminApiKey = "your-admin-api-key"; // Replace with your API key
  
  try {
    const response = await fetch('/api/orders/mark-complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-API-Key': adminApiKey
      },
      body: JSON.stringify({
        orderId: orderId
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Order marked as complete:', result);
    } else {
      console.error('❌ Error:', result);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

// To use this test:
// 1. Set up your environment variables in .env.local
// 2. Replace the orderId and adminApiKey values above
// 3. Run: testOrderCompletion()

export { testOrderCompletion };