import Project from '../models/Project'


export const create_project= async(name, shortDesc, desc, startDate,endDate, repo, deploy, cover, email)=>{
    if (cover === null){
        cover= '';
    } 
    try{ 
        const success= await Project.POST_project(name, shortDesc, desc, startDate,endDate, repo,deploy, cover, email) 
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

export const get_all_display_projects= async() =>{
    try{
        const response= await Project.get_displayed_projects()
        return response;
    }
    catch (error) {
        console.error('Error getting projects:', error);
        throw error;
    }
}

export const toggle_show_project= async(id)=>{
    try{
        const response= await Project.show_project(id);
        return response;
    }catch(error){
        console.log('Error toggling show status',error);
    }
}

export const get_proj_by_name= async(name)=>{
    try{
        const response= await Project.get_by_name(name);
        return response;
    }catch(e){
        console.log(e)
    }
}

export const update_project= async(id, name, shortDesc, desc, startDate, endDate, repo, deploy, cover, images, tags, shown)=>{
    try{ 
        const response= await Project.update_project(id, name, shortDesc, desc, startDate, endDate, repo, deploy, cover, images, tags, shown);
        return response;
    }catch(error){
        console.log('Error updating project',error);
    }
}

export const delete_project= async(id)=>{
    const response= await Project.DELETE_project(id)
    return response;
}