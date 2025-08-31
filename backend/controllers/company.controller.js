import { Company } from "../models/company.model";

export const registerCompany = async (req , res) => {
    try {
        const {companyName} = req.body;
    if(!companyName){
        return res.status(400).json({message:"Company name required", success:false});
    }

    let company = await Company.findOne({name:companyName}) ;
    if(company){
        return res.status(400).json({message:"You can't register same company"});
    }

    company = await Company.create({
        name:companyName,
        userID: req.id
    })

    return res.status(200).json({
        message:"Company registered successfully",
        company,
        success: true
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({userId});
    
        if(!companies){
            return res.status(404).json({message: "Companies not found", success:false});
        }

        return res.status(200).json({companies, success:true});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export const getCompanyById = async (req, res) => {
    
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
    
        if(!company) {
            return res.status(404).json({message: "Company not found", success:false});
        }
    
        return res.status(200).json({company, success:true});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }


}

export const updateCompny = async (req, res) => {
    
    try {
        const {name, description, website, location} = req.body;
        const file = req.file;
        // cloudinary implementation
    
        const updateDate = {name, description, website, location};
    
        const company = await Company.findByIdAndUpdate(req.params.id, updateDate, {new:true});
        if(!comapny){
            return res.status(404).json({message: "Company not found !", success:false})
        }

        return res.status(200).json({
            message: "Company details updated !",
            company,
            success:true
        })
        
    } catch (error) {
        return res.status(500).json({message: "Internal server Error", success:false});
    }
}