import Tag from '../models/Tag'

export const create_tag= async(name, icon)=>{
    try{  
        const success= await Tag.POST_tag(name, icon) 
        return success;
    } catch (error) {
        console.error('Error creating tag:', error);
        throw error;
    }
}

export const get_all_tags= async() =>{
    try{
        const response= await Tag.get_all_tags();
        return response;
    }
    catch (error) {
        console.error('Error getting tags:', error);
        throw error;
    }
}