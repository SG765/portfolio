import Project from '../models/Project'


export const create_project= async(name, desc, startDate,endDate, repo, deploy)=>{
    try{
        const success= await Project.POST_project(name, desc, startDate,endDate, repo,deploy)
        console.log(success)
        return success;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
}

export const get_all_projects= async() =>{
    try{
        const response= await Project.get_all_projects()  
        return response;
    }
    catch (error) {
        console.error('Error getting projects:', error);
        throw error;
    }
}