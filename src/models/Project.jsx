import { db } from "../firebase";
import { addDoc, setDoc, collection, doc, updateDoc, getDoc, writeBatch, runTransaction, deleteDoc, query, where, getDocs } from "firebase/firestore";

export default class Project{

    constructor(
        name= '',
        shortDesc='',
        desc='',
        startDate=null,
        endDate=null,
        repo='',
        deploy='',
        cover=''
    ){
        this.name=name;
        this.shortDesc=shortDesc;
        this.desc=desc;
        this.startDate = startDate;  
        this.endDate = endDate;  
        this.repo=repo;
        this.deploy=deploy;
        this.cover=cover;
    }

    static async POST_project ( name, shortDesc, desc, startDate, endDate, repo, deploy, cover, email ) {
        try {
            //create  instance
            const project = new Project( name, shortDesc, desc, startDate, endDate, repo, deploy, cover ); 

            //create collection ref 
            const coll_ref = collection ( db, 'projects');
            
           // Run transaction
           const result = await runTransaction(db, async (transaction) => {
            // Add the project to the collection
            const docRef = doc(coll_ref);
            transaction.set(docRef, { ...project });

            // Get the document ID
            const docId = docRef.id;

            // Update the document with the document ID
            transaction.update(docRef, { id: docId });

            // Initialize subcollection and add document
            const imagesColl = collection(docRef, 'images');
            const imagesDocRef = doc(imagesColl);
            transaction.set(imagesDocRef, {});

            return { docId };
        });

            return { status: 200, body: 'Project successfully created' };

        } catch ( error ) {
            return ( { status: 500 , body: 'Server unable to create project', error } );
        }
    }

    static async get_all_projects (){
        const q= query(collection(db, "projects"))
        const snapshot= await getDocs(q)

        let projects=[];

        for (let docSnapshot of snapshot.docs) {
            let projectData = docSnapshot.data();

            if (projectData.id != null) {
                // Fetch images subcollection
                const imagesQuery = query(collection(db, "projects", docSnapshot.id, "images"));
                const imagesSnapshot = await getDocs(imagesQuery);

                let images = [];
                imagesSnapshot.forEach((imageDoc) => { 
                    images.push(imageDoc.data());
                });

                projectData.images = images;

                const tagsQuery = query(collection(db, "projects", docSnapshot.id, "tags"));
                const tagssSnapshot = await getDocs(tagsQuery);

                let tags= []
                tagssSnapshot.forEach((tagsDoc) =>{
                    tags.push(tagsDoc.data())
                });

                projectData.tags = tags;

                projects.push(projectData);
            }
        } 

        return {status: 200, body: projects};
    }

    static async get_displayed_projects(){
        const allProjects= await this.get_all_projects();
        const displayed= allProjects.body.filter(project => project.shown === true)

        if(displayed.length > 0){
            return {status: 200, body: displayed}
        }else{
            return {status: 404, body: "No projects to display found"}
        }
    }

    static async get_project_by_id(id){
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
         return docSnap.data();
        } else { 
            console.log("No project found");
        }

    }

    static async get_by_name(name){
        const q= query(collection(db, "projects"))
        const snapshot= await getDocs(q)

        let projects = [];

        for (let docSnapshot of snapshot.docs) {
            let projectData = docSnapshot.data();

            if (projectData.name === name) {
                // Fetch images subcollection
                const imagesQuery = query(collection(db, "projects", docSnapshot.id, "images"));
                const imagesSnapshot = await getDocs(imagesQuery);

                let images = [];
                imagesSnapshot.forEach((imageDoc) => { 
                    images.push({
                        id: imageDoc.id, //add the id which would be used for reordering images
                        ...imageDoc.data(),
                    });
                });

                projectData.images = images;

                const tagsQuery = query(collection(db, "projects", docSnapshot.id, "tags"));
                const tagssSnapshot = await getDocs(tagsQuery);

                let tags= []
                tagssSnapshot.forEach((tagsDoc) =>{
                    tags.push(tagsDoc.data())
                });

                projectData.tags = tags;

                projects.push(projectData);
            }
        } 
        return {status: 200, body: projects};
    }

    static async show_project(id){
        let doc_snapshot;
        let status;
        try{
            await runTransaction( db, async ( transaction ) => {
                const doc_ref= doc(db, "projects", id)
                doc_snapshot = await getDoc ( doc_ref );

                if ( !doc_snapshot.exists() || doc_snapshot.empty ) {
                    console.log ( 'document does not exist' );
                    return false;
                }

                if(!doc_snapshot.data().shown){
                    status= "Displayed";
                }else{
                    status="Hidden";
                }

                transaction.update(doc_ref, {
                    shown: !doc_snapshot.data().shown,
                });
            })


            return {status: 200, body: `${doc_snapshot.data().name} is now ${status}`}
        }catch(error){
            console.log("Error toggling status: ", error)
        }
        
    }

    static async update_project(id, name, shortDesc, desc, startDate, endDate, repo, deploy, cover, images, tags, shown){
        let doc_snapshot;  
        try{
            await runTransaction( db, async ( transaction ) => {
                const doc_ref= doc(db, "projects", id)
                doc_snapshot = await getDoc ( doc_ref );

                if ( !doc_snapshot.exists() || doc_snapshot.empty ) {
                    console.log ( 'document does not exist' );
                    return false;
                }

                transaction.update(doc_ref, {
                    name: name,
                    shortDesc: shortDesc,
                    desc: desc,
                    startDate: startDate,
                    endDate:endDate,
                    repo: repo,
                    deploy: deploy,
                    cover: cover,
                    shown: shown,
                });

                 // Update images 
                const imagesCollectionRef = collection(doc_ref, 'images');

                // Delete existing images to prevent dups
                const existingImagesSnapshot = await getDocs(imagesCollectionRef);
                existingImagesSnapshot.forEach((doc) => {
                    transaction.delete(doc.ref);
                });

                // Add new images to the subcollection
                images.forEach((image, index) => {
                    const imageDocRef = doc(imagesCollectionRef, `image${index}`);
                    transaction.set(imageDocRef, image);
                });

                 // Update tags 
                 const tagsCollectionRef = collection(doc_ref, 'tags');

                 // Delete existing to prevent dups
                 const existingTagsSnapshot = await getDocs(tagsCollectionRef);
                 existingTagsSnapshot.forEach((doc) => {
                     transaction.delete(doc.ref);
                 });
 
                 // Add new tags to the subcollection
                 tags.forEach((tag, index) => {
                     const tagDocRef = doc(tagsCollectionRef, `tag${index}`);
                     transaction.set(tagDocRef, tag);
                 });


            })


            return {status: 200, body: `Project has been updated successfully`}
        }catch(error){
            console.log("Error updating project: ", error)
        }
        
    }

    static async DELETE_project(id){
        try{
            const doc_ref= doc(db, "projects", id)
            const snap = getDoc(doc_ref)

            if (!snap){
                console.error ( 'project doc does not exist', error);
                return "No such project";
            }

            // Delete all documents in the "images" subcollection
            const imagesCollectionRef = collection(doc_ref, "images");
            const imagesQuery = query(imagesCollectionRef);
            const imagesSnap = await getDocs(imagesQuery);

            const deleteImagePromises = imagesSnap.docs.map(async (imageDoc) => {
                await deleteDoc(imageDoc.ref);
            });

            await Promise.all(deleteImagePromises);


            await deleteDoc(doc_ref)

            return {status: 200, body: `Project Deleted`}

        }catch(e){
            console.log("Error deleting project: ", e)
        }
    }

}