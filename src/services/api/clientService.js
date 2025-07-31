import clientsData from '@/services/mockData/clients.json'

let clients = [...clientsData]
let nextId = Math.max(...clients.map(c => c.Id)) + 1

export const clientService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    return [...clients]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 50))
    const client = clients.find(c => c.Id === parseInt(id))
    if (!client) {
      throw new Error('Client not found')
    }
    return { ...client }
  },

  async create(clientData) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const newClient = {
      ...clientData,
      Id: nextId++,
      createdAt: new Date().toISOString()
    }
    
    clients.unshift(newClient)
    return { ...newClient }
  },

  async update(id, clientData) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = clients.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Client not found')
    }
    
    const updatedClient = {
      ...clients[index],
      ...clientData,
      Id: parseInt(id) // Ensure ID doesn't change
    }
    
    clients[index] = updatedClient
    return { ...updatedClient }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const index = clients.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Client not found')
    }
    
    clients.splice(index, 1)
    return true
  }
}