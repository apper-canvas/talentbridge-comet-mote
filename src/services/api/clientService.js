// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'client_c';

export const clientService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "companyName_c" } },
          { field: { Name: "contactPerson_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "relationshipStatus_c" } },
          { field: { Name: "createdAt_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(client => ({
        Id: client.Id,
        companyName: client.companyName_c,
        contactPerson: client.contactPerson_c,
        email: client.email_c,
        phone: client.phone_c,
        address: client.address_c,
        relationshipStatus: client.relationshipStatus_c,
        createdAt: client.createdAt_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching clients:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "companyName_c" } },
          { field: { Name: "contactPerson_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "relationshipStatus_c" } },
          { field: { Name: "createdAt_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const client = response.data;
      return {
        Id: client.Id,
        companyName: client.companyName_c,
        contactPerson: client.contactPerson_c,
        email: client.email_c,
        phone: client.phone_c,
        address: client.address_c,
        relationshipStatus: client.relationshipStatus_c,
        createdAt: client.createdAt_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching client with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(clientData) {
    try {
      const params = {
        records: [
          {
            Name: clientData.companyName || `Client ${Date.now()}`,
            companyName_c: clientData.companyName,
            contactPerson_c: clientData.contactPerson,
            email_c: clientData.email,
            phone_c: clientData.phone,
            address_c: clientData.address,
            relationshipStatus_c: clientData.relationshipStatus || 'prospect',
            createdAt_c: new Date().toISOString()
          }
        ]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create clients ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const client = successfulRecords[0].data;
          return {
            Id: client.Id,
            companyName: client.companyName_c,
            contactPerson: client.contactPerson_c,
            email: client.email_c,
            phone: client.phone_c,
            address: client.address_c,
            relationshipStatus: client.relationshipStatus_c,
            createdAt: client.createdAt_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating client:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, clientData) {
    try {
      const updatePayload = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (clientData.companyName !== undefined) updatePayload.companyName_c = clientData.companyName;
      if (clientData.contactPerson !== undefined) updatePayload.contactPerson_c = clientData.contactPerson;
      if (clientData.email !== undefined) updatePayload.email_c = clientData.email;
      if (clientData.phone !== undefined) updatePayload.phone_c = clientData.phone;
      if (clientData.address !== undefined) updatePayload.address_c = clientData.address;
      if (clientData.relationshipStatus !== undefined) updatePayload.relationshipStatus_c = clientData.relationshipStatus;
      
      const params = {
        records: [updatePayload]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update clients ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const client = successfulUpdates[0].data;
          return {
            Id: client.Id,
            companyName: client.companyName_c,
            contactPerson: client.contactPerson_c,
            email: client.email_c,
            phone: client.phone_c,
            address: client.address_c,
            relationshipStatus: client.relationshipStatus_c,
            createdAt: client.createdAt_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating client:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting client:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};