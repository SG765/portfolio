import { db } from "../firebase";
import { addDoc, setDoc, collection, doc, updateDoc, getDoc, writeBatch, runTransaction, deleteDoc, query, where, getDocs } from "firebase/firestore";

export default class Tag{

    constructor(name= '', icon=''){
        this.name=name;
        this.icon= icon;
    }

    static async POST_tag ( name, icon ) {
        try {
            // Check if tag with the same name already exists
            const querySnapshot = await getDocs(query(collection(db, 'tags'), where('name', '==', name)));
            if (!querySnapshot.empty) {
                return { status: 400, body: 'This tag already exists in the database' };
            }

            //create  instance
            const tag = new Tag( name, icon ); 

            //create collection ref 
            const coll_ref = collection ( db, 'tags');
            
           // transaction
           const result = await runTransaction(db, async (transaction) => {
                const docRef = doc(coll_ref);
                transaction.set(docRef, { ...tag });

                // Get the document ID
                const docId = docRef.id;

                // Update the document with the document ID
                transaction.update(docRef, { id: docId });

                return { docId };
            });

            return { status: 200, body: 'Tag added to database' };

        } catch ( error ) {
            return ( { status: 500 , body: 'Server unable to create tag', error } );
        }
    }

    static async DELETE_tag(id){
        try{
            const doc_ref= doc(db, "tags", id)
            const snap = getDoc(doc_ref)

            if (!snap){
                console.error ( 'tag doc does not exist', error);
                return "No such tag";
            } 

            await deleteDoc(doc_ref)


        // remove the tag from all projects'
        const projects_ref = collection(db, "projects");
        const projectSnapshot = await getDocs(projects_ref);

        projectSnapshot.forEach(async (projectDoc) => {
            const projectID = projectDoc.id;
            const projectTagsRef = collection(db, "projects", projectID, "tags");
 
            const projectTagSnapshot = await getDocs(projectTagsRef);
            projectTagSnapshot.forEach(async (tagDoc) => {
                const projectTagData = tagDoc.data();

                if (projectTagData.id === id) {
                    // If the tag matches, delete it from the project
                    const tagToDeleteRef = doc(db, "projects", projectID, "tags", tagDoc.id);
                    await deleteDoc(tagToDeleteRef); 
                }
            });
        });
            return {status: 200, body: `Tag Deleted from Database`}

        }catch(e){
            console.log("Error deleting project: ", e)
        }
    }

    static async get_all_tags (){
        const q= query(collection(db, "tags"))
        const snapshot= await getDocs(q)

        let tags=[];

        for (let docSnapshot of snapshot.docs) {
            let tagData = docSnapshot.data(); 

            if (tagData.id != null) {

                tags.push(tagData);
            }
        } 

        return {status: 200, body: tags};
    }

    static async UPDATE_tag(id, name, icon){
        let doc_snap;
        try{
            //to be continued
        }catch (e){
            console.log(e)
        }
    }


}