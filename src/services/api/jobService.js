// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'job_c';

export const jobService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "clientId_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "jobType_c" } },
          { field: { Name: "salaryMin_c" } },
          { field: { Name: "salaryMax_c" } },
          { field: { Name: "experienceLevel_c" } },
          { field: { Name: "requiredSkills_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "applicants_c" } }
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
      
      return response.data.map(job => ({
        Id: job.Id,
        title: job.title_c,
        company: job.company_c,
        clientId: job.clientId_c,
        location: job.location_c,
        jobType: job.jobType_c,
        salaryMin: job.salaryMin_c,
        salaryMax: job.salaryMax_c,
        experienceLevel: job.experienceLevel_c,
        requiredSkills: job.requiredSkills_c,
        description: job.description_c,
        status: job.status_c,
        createdAt: job.createdAt_c,
        applicants: job.applicants_c || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching jobs:", error?.response?.data?.message);
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
          { field: { Name: "title_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "clientId_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "jobType_c" } },
          { field: { Name: "salaryMin_c" } },
          { field: { Name: "salaryMax_c" } },
          { field: { Name: "experienceLevel_c" } },
          { field: { Name: "requiredSkills_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "applicants_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const job = response.data;
      return {
        Id: job.Id,
        title: job.title_c,
        company: job.company_c,
        clientId: job.clientId_c,
        location: job.location_c,
        jobType: job.jobType_c,
        salaryMin: job.salaryMin_c,
        salaryMax: job.salaryMax_c,
        experienceLevel: job.experienceLevel_c,
        requiredSkills: job.requiredSkills_c,
        description: job.description_c,
        status: job.status_c,
        createdAt: job.createdAt_c,
        applicants: job.applicants_c || 0
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching job with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async create(jobData) {
    try {
      const params = {
        records: [
          {
            Name: jobData.title || `Job ${Date.now()}`,
            title_c: jobData.title,
            company_c: jobData.company,
            clientId_c: jobData.clientId ? parseInt(jobData.clientId) : null,
            location_c: jobData.location,
            jobType_c: jobData.jobType,
            salaryMin_c: jobData.salaryMin ? parseInt(jobData.salaryMin) : null,
            salaryMax_c: jobData.salaryMax ? parseInt(jobData.salaryMax) : null,
            experienceLevel_c: jobData.experienceLevel,
            requiredSkills_c: jobData.requiredSkills,
            description_c: jobData.description,
            status_c: jobData.status || 'active',
            createdAt_c: new Date().toISOString(),
            applicants_c: 0
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
          console.error(`Failed to create jobs ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const job = successfulRecords[0].data;
          return {
            Id: job.Id,
            title: job.title_c,
            company: job.company_c,
            clientId: job.clientId_c,
            location: job.location_c,
            jobType: job.jobType_c,
            salaryMin: job.salaryMin_c,
            salaryMax: job.salaryMax_c,
            experienceLevel: job.experienceLevel_c,
            requiredSkills: job.requiredSkills_c,
            description: job.description_c,
            status: job.status_c,
            createdAt: job.createdAt_c,
            applicants: job.applicants_c || 0
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating job:", error?.response?.data?.message);
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
      if (updateData.title !== undefined) updatePayload.title_c = updateData.title;
      if (updateData.company !== undefined) updatePayload.company_c = updateData.company;
      if (updateData.clientId !== undefined) updatePayload.clientId_c = updateData.clientId ? parseInt(updateData.clientId) : null;
      if (updateData.location !== undefined) updatePayload.location_c = updateData.location;
      if (updateData.jobType !== undefined) updatePayload.jobType_c = updateData.jobType;
      if (updateData.salaryMin !== undefined) updatePayload.salaryMin_c = updateData.salaryMin ? parseInt(updateData.salaryMin) : null;
      if (updateData.salaryMax !== undefined) updatePayload.salaryMax_c = updateData.salaryMax ? parseInt(updateData.salaryMax) : null;
      if (updateData.experienceLevel !== undefined) updatePayload.experienceLevel_c = updateData.experienceLevel;
      if (updateData.requiredSkills !== undefined) updatePayload.requiredSkills_c = updateData.requiredSkills;
      if (updateData.description !== undefined) updatePayload.description_c = updateData.description;
      if (updateData.status !== undefined) updatePayload.status_c = updateData.status;
      if (updateData.applicants !== undefined) updatePayload.applicants_c = updateData.applicants;
      
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
          console.error(`Failed to update jobs ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const job = successfulUpdates[0].data;
          return {
            Id: job.Id,
            title: job.title_c,
            company: job.company_c,
            clientId: job.clientId_c,
            location: job.location_c,
            jobType: job.jobType_c,
            salaryMin: job.salaryMin_c,
            salaryMax: job.salaryMax_c,
            experienceLevel: job.experienceLevel_c,
            requiredSkills: job.requiredSkills_c,
            description: job.description_c,
            status: job.status_c,
            createdAt: job.createdAt_c,
            applicants: job.applicants_c || 0
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating job:", error?.response?.data?.message);
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
        console.error("Error deleting job:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
};