// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'application_c';

export const applicationService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "jobId_c" } },
          { field: { Name: "candidateId_c" } },
          { field: { Name: "appliedAt_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "interview_c" } }
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
      
return response.data.map(app => {
        let interview = null;
        let interviewNotes = '';
        
        if (app.interview_c) {
          try {
            interview = JSON.parse(app.interview_c);
          } catch (error) {
            // If parsing fails, treat as plain text notes
            interviewNotes = app.interview_c;
          }
        }
        
        return {
          Id: app.Id,
          jobId: app.jobId_c,
          candidateId: app.candidateId_c,
          appliedAt: app.appliedAt_c,
          status: app.status_c,
          notes: app.notes_c || '',
          interview,
          interviewNotes
        };
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching applications:", error?.response?.data?.message);
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
          { field: { Name: "jobId_c" } },
          { field: { Name: "candidateId_c" } },
          { field: { Name: "appliedAt_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "interview_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const app = response.data;
let interview = null;
      let interviewNotes = '';
      
      if (app.interview_c) {
        try {
          interview = JSON.parse(app.interview_c);
        } catch (error) {
          // If parsing fails, treat as plain text notes
          interviewNotes = app.interview_c;
        }
      }
      
      return {
        Id: app.Id,
        jobId: app.jobId_c,
        candidateId: app.candidateId_c,
        appliedAt: app.appliedAt_c,
        status: app.status_c,
        notes: app.notes_c || '',
        interview,
        interviewNotes
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching application with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async create(applicationData) {
    try {
      const params = {
        records: [
          {
            Name: applicationData.Name || `Application ${Date.now()}`,
            jobId_c: parseInt(applicationData.jobId),
            candidateId_c: parseInt(applicationData.candidateId),
            appliedAt_c: new Date().toISOString(),
            status_c: 'applied',
            notes_c: applicationData.notes || ''
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
          console.error(`Failed to create applications ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const app = successfulRecords[0].data;
          return {
            Id: app.Id,
            jobId: app.jobId_c,
            candidateId: app.candidateId_c,
            appliedAt: app.appliedAt_c,
            status: app.status_c,
            notes: app.notes_c || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating application:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async updateStatus(applicationId, newStatus) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(applicationId),
            status_c: newStatus
          }
        ]
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
          console.error(`Failed to update applications ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const app = successfulUpdates[0].data;
          return {
            Id: app.Id,
            jobId: app.jobId_c,
            candidateId: app.candidateId_c,
            appliedAt: app.appliedAt_c,
            status: app.status_c,
            notes: app.notes_c || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating application status:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async update(id, applicationData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (applicationData.jobId_c !== undefined) updateData.jobId_c = parseInt(applicationData.jobId_c);
      if (applicationData.candidateId_c !== undefined) updateData.candidateId_c = parseInt(applicationData.candidateId_c);
      if (applicationData.appliedAt_c !== undefined) updateData.appliedAt_c = applicationData.appliedAt_c;
      if (applicationData.status_c !== undefined) updateData.status_c = applicationData.status_c;
      if (applicationData.notes_c !== undefined) updateData.notes_c = applicationData.notes_c;
      if (applicationData.interview_c !== undefined) updateData.interview_c = typeof applicationData.interview_c === 'string' ? applicationData.interview_c : JSON.stringify(applicationData.interview_c);
      
      const params = {
        records: [updateData]
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
          console.error(`Failed to update applications ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
const app = successfulUpdates[0].data;
          
          let interview = null;
          let interviewNotes = '';
          
          if (app.interview_c) {
            try {
              interview = JSON.parse(app.interview_c);
            } catch (error) {
              // If parsing fails, treat as plain text notes
              interviewNotes = app.interview_c;
            }
          }
          
          return {
            Id: app.Id,
            jobId: app.jobId_c,
            candidateId: app.candidateId_c,
            appliedAt: app.appliedAt_c,
            status: app.status_c,
            notes: app.notes_c || '',
            interview,
            interviewNotes
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating application:", error?.response?.data?.message);
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
        console.error("Error deleting application:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async checkApplication(jobId, candidateId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "jobId_c" } },
          { field: { Name: "candidateId_c" } }
        ],
        where: [
          {
            FieldName: "jobId_c",
            Operator: "EqualTo",
            Values: [parseInt(jobId)]
          },
          {
            FieldName: "candidateId_c", 
            Operator: "EqualTo",
            Values: [parseInt(candidateId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }
      
      const app = response.data[0];
      return {
        Id: app.Id,
        jobId: app.jobId_c,
        candidateId: app.candidateId_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error checking application:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async scheduleInterview(applicationId, interviewData) {
    try {
      const interviewJson = JSON.stringify(interviewData);
      
      const params = {
        records: [
          {
            Id: parseInt(applicationId),
            interview_c: interviewJson,
            status_c: 'interview_scheduled'
          }
        ]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
const app = response.results[0].data;
        
        let interview = null;
        let interviewNotes = '';
        
        if (app.interview_c) {
          try {
            interview = JSON.parse(app.interview_c);
          } catch (error) {
            // If parsing fails, treat as plain text notes
            interviewNotes = app.interview_c;
          }
        }
        
        return {
          Id: app.Id,
          jobId: app.jobId_c,
          candidateId: app.candidateId_c,
          appliedAt: app.appliedAt_c,
          status: app.status_c,
          notes: app.notes_c || '',
          interview,
          interviewNotes
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error scheduling interview:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async getUpcomingInterviews() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "jobId_c" } },
          { field: { Name: "candidateId_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "interview_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo", 
            Values: ["interview_scheduled"]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success || !response.data) {
        return [];
      }
      
      const now = new Date();
const upcomingInterviews = response.data
        .filter(app => app.interview_c)
        .map(app => {
          try {
            const interview = JSON.parse(app.interview_c);
            const interviewDateTime = new Date(`${interview.date}T${interview.time}`);
            return {
              ...app,
              interview,
              interviewDateTime
            };
          } catch (error) {
            // Skip applications with invalid interview JSON
            return null;
          }
        })
        .filter(app => app !== null && app.interviewDateTime >= now)
        .sort((a, b) => a.interviewDateTime - b.interviewDateTime);

      return upcomingInterviews.map(app => ({
        Id: app.Id,
        jobId: app.jobId_c,
        candidateId: app.candidateId_c,
        status: app.status_c,
        interview: app.interview
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching upcoming interviews:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }
};