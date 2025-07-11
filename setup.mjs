import fs from 'fs'
import path from 'path'

const services = [
  {
    name: 'locationSelector',
    target: 'src/location-selector/services.config.js'
  }
]

const endpoint = 'https://api.data-forge.tech'

async function setupService(service) {
  if (fs.existsSync(service.target)) {
    //console.log(`⚠️  ${service.name} already configured. Skipping.`)
    //return
  }

  try {
    const axios = await import('axios').then(mod => mod.default)

    const res = await axios.post(`${endpoint}/api/guest-task/Services/Install`, {
      subtype: 'react',
      source: service.name,
      version: '0.2.1'
    })

    const config = {
      [service.name]: {
        token: res.data.token,
        endpoint
      }
    }

    fs.mkdirSync(path.dirname(service.target), { recursive: true })
    fs.writeFileSync(service.target, `export default ${JSON.stringify(config, null, 2)}\n`)
    console.log(`✅ Token written to ${service.target}`)
  } catch (err) {
    console.error(`❌ Failed for ${service.name}: ${endpoint}`, err)
  }
}

async function run() {
  for (const service of services) {
    await setupService(service)
  }
}

run()
