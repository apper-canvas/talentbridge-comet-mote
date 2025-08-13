// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'candidate_c';

export const candidateService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "currentJobTitle_c" } },
          { field: { Name: "position_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "appliedAt_c" } },
          { field: { Name: "experienceLevel_c" } },
          { field: { Name: "skills_c" } },
          { field: { Name: "resumeSummary_c" } },
          { field: { Name: "availability_c" } }
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
      
      return response.data.map(candidate => ({
        Id: candidate.Id,
        name: candidate.Name,
        email: candidate.email_c,
        phone: candidate.phone_c,
        location: candidate.location_c,
        currentJobTitle: candidate.currentJobTitle_c,
        position: candidate.position_c,
        status: candidate.status_c,
        appliedAt: candidate.appliedAt_c,
        experienceLevel: candidate.experienceLevel_c,
        skills: candidate.skills_c ? candidate.skills_c.split(',') : [],
        resumeSummary: candidate.resumeSummary_c,
        availability: candidate.availability_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching candidates:", error?.response?.data?.message);
      } else {
        console.error(error);
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
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "currentJobTitle_c" } },
          { field: { Name: "position_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "appliedAt_c" } },
          { field: { Name: "experienceLevel_c" } },
          { field: { Name: "skills_c" } },
          { field: { Name: "resumeSummary_c" } },
          { field: { Name: "availability_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const candidate = response.data;
      return {
        Id: candidate.Id,
        name: candidate.Name,
        email: candidate.email_c,
        phone: candidate.phone_c,
        location: candidate.location_c,
        currentJobTitle: candidate.currentJobTitle_c,
        position: candidate.position_c,
        status: candidate.status_c,
        appliedAt: candidate.appliedAt_c,
        experienceLevel: candidate.experienceLevel_c,
        skills: candidate.skills_c ? candidate.skills_c.split(',') : [],
        resumeSummary: candidate.resumeSummary_c,
        availability: candidate.availability_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching candidate with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async create(candidateData) {
    try {
      const params = {
        records: [
          {
            Name: candidateData.name,
            email_c: candidateData.email,
            phone_c: candidateData.phone,
            location_c: candidateData.location,
            currentJobTitle_c: candidateData.currentJobTitle,
            position_c: candidateData.position,
            status_c: candidateData.status || 'new',
            appliedAt_c: new Date().toISOString(),
            experienceLevel_c: candidateData.experienceLevel || 'entry',
            skills_c: Array.isArray(candidateData.skills) ? candidateData.skills.join(',') : candidateData.skills,
            resumeSummary_c: candidateData.resumeSummary,
            availability_c: candidateData.availability || 'available'
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
          console.error(`Failed to create candidates ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const candidate = successfulRecords[0].data;
          return {
            Id: candidate.Id,
            name: candidate.Name,
            email: candidate.email_c,
            phone: candidate.phone_c,
            location: candidate.location_c,
            currentJobTitle: candidate.currentJobTitle_c,
            position: candidate.position_c,
            status: candidate.status_c,
            appliedAt: candidate.appliedAt_c,
            experienceLevel: candidate.experienceLevel_c,
            skills: candidate.skills_c ? candidate.skills_c.split(',') : [],
            resumeSummary: candidate.resumeSummary_c,
            availability: candidate.availability_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating candidate:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const updatePayload = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (updateData.name !== undefined) updatePayload.Name = updateData.name;
      if (updateData.email !== undefined) updatePayload.email_c = updateData.email;
      if (updateData.phone !== undefined) updatePayload.phone_c = updateData.phone;
      if (updateData.location !== undefined) updatePayload.location_c = updateData.location;
      if (updateData.currentJobTitle !== undefined) updatePayload.currentJobTitle_c = updateData.currentJobTitle;
      if (updateData.position !== undefined) updatePayload.position_c = updateData.position;
      if (updateData.status !== undefined) updatePayload.status_c = updateData.status;
      if (updateData.appliedAt !== undefined) updatePayload.appliedAt_c = updateData.appliedAt;
      if (updateData.experienceLevel !== undefined) updatePayload.experienceLevel_c = updateData.experienceLevel;
      if (updateData.skills !== undefined) updatePayload.skills_c = Array.isArray(updateData.skills) ? updateData.skills.join(',') : updateData.skills;
      if (updateData.resumeSummary !== undefined) updatePayload.resumeSummary_c = updateData.resumeSummary;
      if (updateData.availability !== undefined) updatePayload.availability_c = updateData.availability;
      
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
          console.error(`Failed to update candidates ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const candidate = successfulUpdates[0].data;
          return {
            Id: candidate.Id,
            name: candidate.Name,
            email: candidate.email_c,
            phone: candidate.phone_c,
            location: candidate.location_c,
            currentJobTitle: candidate.currentJobTitle_c,
            position: candidate.position_c,
            status: candidate.status_c,
            appliedAt: candidate.appliedAt_c,
            experienceLevel: candidate.experienceLevel_c,
            skills: candidate.skills_c ? candidate.skills_c.split(',') : [],
            resumeSummary: candidate.resumeSummary_c,
            availability: candidate.availability_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating candidate:", error?.response?.data?.message);
      } else {
        console.error(error);
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
        console.error("Error deleting candidate:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
};