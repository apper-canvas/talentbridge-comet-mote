// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'note_c';

export const noteService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "entityType_c" } },
          { field: { Name: "entityId_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } }
        ],
        orderBy: [
          {
            fieldName: "createdAt_c",
            sorttype: "DESC"
          }
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
      
      return response.data.map(note => ({
        Id: note.Id,
        entityType: note.entityType_c,
        entityId: note.entityId_c,
        category: note.category_c,
        content: note.content_c,
        createdAt: note.createdAt_c,
        updatedAt: note.updatedAt_c,
        createdBy: note.Owner?.Name || 'Unknown'
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notes:", error?.response?.data?.message);
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
          { field: { Name: "entityType_c" } },
          { field: { Name: "entityId_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const note = response.data;
      return {
        Id: note.Id,
        entityType: note.entityType_c,
        entityId: note.entityId_c,
        category: note.category_c,
        content: note.content_c,
        createdAt: note.createdAt_c,
        updatedAt: note.updatedAt_c,
        createdBy: note.Owner?.Name || 'Unknown'
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching note with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async getByEntity(entityType, entityId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "entityType_c" } },
          { field: { Name: "entityId_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } }
        ],
        where: [
          {
            FieldName: "entityType_c",
            Operator: "EqualTo",
            Values: [entityType]
          },
          {
            FieldName: "entityId_c",
            Operator: "EqualTo",
            Values: [parseInt(entityId)]
          }
        ],
        orderBy: [
          {
            fieldName: "createdAt_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success || !response.data) {
        return [];
      }
      
      return response.data.map(note => ({
        Id: note.Id,
        entityType: note.entityType_c,
        entityId: note.entityId_c,
        category: note.category_c,
        content: note.content_c,
        createdAt: note.createdAt_c,
        updatedAt: note.updatedAt_c,
        createdBy: note.Owner?.Name || 'Unknown'
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notes by entity:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(noteData) {
    try {
      const params = {
        records: [
          {
            Name: `Note ${Date.now()}`,
            entityType_c: noteData.entityType,
            entityId_c: parseInt(noteData.entityId),
            category_c: noteData.category,
            content_c: noteData.content?.trim(),
            createdAt_c: new Date().toISOString(),
            updatedAt_c: new Date().toISOString()
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
          console.error(`Failed to create notes ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const note = successfulRecords[0].data;
          return {
            Id: note.Id,
            entityType: note.entityType_c,
            entityId: note.entityId_c,
            category: note.category_c,
            content: note.content_c,
            createdAt: note.createdAt_c,
            updatedAt: note.updatedAt_c,
            createdBy: note.Owner?.Name || 'Unknown'
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating note:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const updatePayload = {
        Id: parseInt(id),
        updatedAt_c: new Date().toISOString()
      };
      
      // Only include updateable fields
      if (updateData.entityType !== undefined) updatePayload.entityType_c = updateData.entityType;
      if (updateData.entityId !== undefined) updatePayload.entityId_c = parseInt(updateData.entityId);
      if (updateData.category !== undefined) updatePayload.category_c = updateData.category;
      if (updateData.content !== undefined) updatePayload.content_c = updateData.content?.trim();
      
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
          console.error(`Failed to update notes ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const note = successfulUpdates[0].data;
          return {
            Id: note.Id,
            entityType: note.entityType_c,
            entityId: note.entityId_c,
            category: note.category_c,
            content: note.content_c,
            createdAt: note.createdAt_c,
            updatedAt: note.updatedAt_c,
            createdBy: note.Owner?.Name || 'Unknown'
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating note:", error?.response?.data?.message);
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
        console.error("Error deleting note:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  // Helper method to check if note can be edited (within 24 hours)
  canEdit(note) {
    const noteTime = new Date(note.createdAt);
    const now = new Date();
    const hoursDiff = (now - noteTime) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  }
};