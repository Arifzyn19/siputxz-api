import { SiputzxAPI } from '../src';

async function main() {
  // Inisialisasi API dengan konfigurasi opsional
  const api = new SiputzxAPI({
    // BASE_URL: "https://api.siputzx.my.id", // Opsional, default ke URL ini
    // apikey: 'api-key-anda',                // Opsional
  });

  console.log('Menunggu inisialisasi endpoint...');
  // Tunggu hingga semua endpoint selesai diinisialisasi
  await api.initializeEndpoints();
  console.log('Inisialisasi selesai!\n');

  try {
    // 1. Melihat kategori yang tersedia
    const endpoints = await api.getEndpoints();
    console.log('Kategori API yang tersedia:');
    Object.keys(endpoints.routes).forEach(category => {
      console.log(`- ${category} (${endpoints.routes[category].endpoints.length} endpoint)`);
    });
    console.log('');

    // 2. Menggunakan endpoint AI yang otomatis di-generate
    if (api.ai && api.ai.llama33) {
      console.log('Memanggil endpoint Llama3.3...');
      const llamaResponse = await api.ai.llama33({
        prompt: 'Be a helpful assistant',
        text: 'Berikan saya tips untuk belajar TypeScript'
      });
      console.log('Respons Llama3.3:', llamaResponse);
      console.log('');
    }

    // 3. Melihat informasi dan parameter contoh untuk endpoint
    if (api.ai) {
      Object.keys(api.ai).forEach(endpointName => {
        if (typeof api.ai[endpointName] === 'function' && api.ai[endpointName].endpoint) {
          const endpoint = api.ai[endpointName].endpoint;
          const exampleParams = api.ai[endpointName].exampleParams;
          
          console.log(`Endpoint: ${endpoint.name}`);
          console.log(`- Path: ${endpoint.path}`);
          console.log(`- Method: ${endpoint.method}`);
          console.log(`- Parameter contoh:`, exampleParams);
          console.log('');
        }
      });
    }

    // 4. Menggunakan request generic untuk endpoint yang diinginkan
    console.log('Menggunakan request generic GET...');
    const weatherData = await api.get('/api/tools/weather', { city: 'Jakarta' });
    console.log('Data cuaca:', weatherData);

  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);