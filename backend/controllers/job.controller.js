import mongoose from "mongoose";
import { Job } from "../models/job.model.js";

// admin can create job post
export const postJob = async (req, res) => {
    try {
        const {title,description,requirements,salary, experience,location,jobType,position,companyId,} = req.body;
        const userId = req.id; 

        if(!title || !description || !salary || !location || !jobType || !position || !companyId || !experience){
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const job =await Job.create({
            title,
            description,
            requirements: requirements.split(','),
            salary:Number(salary),
            location,
            jobType,
            position,
            experienceLevel: experience,
            company: companyId,
            created_by: userId
        })

        return res.status(201).json({ message: "Job posted successfully", success: true, data: job });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

// anyone can get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keywords = req.query.keywords || "";
        const queary = {
            $or: [
                { title: { $regex: keywords, $options: 'i' } },
                { description: { $regex: keywords, $options: 'i' } },
            ]
        }

        const jobs = await Job.find(queary).populate({
          path:"company"
        }).sort({createdAt:-1});
        if(!jobs){
            return res.status(404).json({ message: "No jobs found", success: false });
        }
        return res.status(200).json({ message: "Jobs fetched successfully", success: true, data: jobs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

// anyone can get job by id
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID", success: false });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ message: "Job fetched successfully", success: true, data: job });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// admin can get all their jobs
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id; // use req.id instead of req.user.id
    const jobs = await Job.find({ created_by: adminId });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found", success: false });
    }

    return res.status(200).json({
      message: "Jobs fetched successfully",
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};


// admin can delete job
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const adminId = req.id; // use req.id here

    const job = await Job.findOneAndDelete({ _id: jobId, created_by: adminId });

    if (!job) {
      return res.status(404).json({ message: "Job not found or you are not authorized", success: false });
    }

    return res.status(200).json({ message: "Job deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

