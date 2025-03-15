# SiputzxAPI Wrapper

Wrapper TypeScript untuk SiputzxAPI (https://api.siputzx.my.id) dengan kemampuan otomatis mengambil endpoint.

## Instalasi

```bash
npm install siputzx-api
```

## Cara Penggunaan

### Penggunaan Dasar

```typescript
import { SiputzxAPI } from 'siputzx-api';

// Inisialisasi client API
const api = new SiputzxAPI({
  BASE_URL: 'https://api.siputzx.my.id',  // Opsional, default ke URL ini
  apikey: 'your-api-key'                  // Opsional
});

// Semua endpoint akan otomatis diambil dari API
await api.initializeEndpoints();

// Metode request generik
async function contohRequest() {
  // Request GET
  const getData = await api.get('/api/endpoint', { param1: 'value1' });
  console.log(getData);
  
  // Request POST
  const postData = await api.post('/api/endpoint', { param1: 'value1' });
  console.log(postData);
}

contohRequest().catch(console.error);
```

### Menggunakan Endpoint AI

```typescript
import { SiputzxAPI } from 'siputzx-api';

const api = new SiputzxAPI();
await api.initializeEndpoints();

async function testAIEndpoints() {
  try {
    // Menggunakan Llama 3.3
    const llama33Response = await api.ai.llama33({ 
      prompt: 'Be a helpful assistant', 
      text: 'hi' 
    });
    console.log('Respons Llama 3.3:', llama33Response);
    
    // Menggunakan Meta Llama 3.3-70B
    const metaLlamaResponse = await api.ai.metaLlama33_70BInstructTurbo({ 
      content: 'hai' 
    });
    console.log('Respons Meta Llama:', metaLlamaResponse);
    
    // Menggunakan Nous Hermes
    const nousHermesResponse = await api.ai.nousHermes({ 
      content: 'hai' 
    });
    console.log('Respons Nous Hermes:', nousHermesResponse);
    
    // Menggunakan Joko Sijawa
    const jokoResponse = await api.ai.joko({ 
      content: 'hai' 
    });
    console.log('Respons Joko:', jokoResponse);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAIEndpoints();
```

### Auto-Discovery Endpoint

Wrapper ini secara otomatis mengambil dan menyiapkan semua endpoint yang tersedia dari API. Semua endpoint dikelompokkan berdasarkan kategori (seperti "ai" untuk AI endpoints).

```typescript
import { SiputzxAPI } from 'siputzx-api';

async function explorerEndpoints() {
  const api = new SiputzxAPI();
  
  // Tunggu hingga endpoint selesai di-load
  await api.initializeEndpoints();
  
  // Dapatkan endpoint yang tersedia
  const endpoints = await api.getEndpoints();
  
  // Cek kategori yang tersedia
  console.log('Kategori yang tersedia:', Object.keys(endpoints.routes));
  
  // Contoh pengaksesan kategori "Ai"
  if (endpoints.routes.Ai) {
    console.log('Endpoint AI:', endpoints.routes.Ai.endpoints.map(e => e.name));
  }
  
  // Menggunakan endpoint dari kategori yang ditemukan secara dinamis
  const categoryKeys = Object.keys(api);
  console.log('Kategori yang tersedia di wrapper:', categoryKeys.filter(k => typeof api[k] === 'object'));
}

explorerEndpoints();
```

### Melihat Parameter Contoh

Setiap endpoint memiliki parameter contoh yang dapat diakses:

```typescript
import { SiputzxAPI } from 'siputzx-api';

async function checkExampleParams() {
  const api = new SiputzxAPI();
  await api.initializeEndpoints();
  
  // Akses parameter contoh untuk endpoint Llama33
  if (api.ai && api.ai.llama33) {
    console.log('Parameter contoh untuk Llama33:', api.ai.llama33.exampleParams);
    // Output: { prompt: 'Be a helpful assistant', text: 'hi' }
  }
}

checkExampleParams();
```

## Fitur

- 🚀 Otomatis mengambil endpoint dari API
- 🔍 Auto-discovery endpoint berdasarkan kategori
- 📝 Parameter contoh untuk setiap endpoint
- 🔄 Dukungan metode HTTP (GET, POST)
- 🔐 Dukungan API key authentication