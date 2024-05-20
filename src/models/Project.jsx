import { db } from "../firebase";
import { addDoc, setDoc, collection, doc, updateDoc, getDoc, writeBatch, runTransaction, deleteDoc, query, where, getDocs } from "firebase/firestore";

export default class Project{

    constructor(
        name= '',
        desc='',
        startDate=null,
        endDate=null,
        repo='',
        deploy='',
        cover=''
    ){
        this.name=name;
        this.desc=desc;
        this.startDate = startDate instanceof Date ? startDate : startDate.toDate(); // change to date
        this.endDate = endDate instanceof Date ? endDate : endDate.toDate(); // change to date
        this.repo=repo;
        this.deploy=deploy;
        this.cover=cover;
    }

    static async POST_project ( name, desc, startDate,endDate, repo, deploy, cover ) {
        try {
            //create  instance
            const project = new Project( name, desc, startDate,endDate, repo, deploy, cover ); 

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
        snapshot.forEach((doc) => {
            if(doc.data().id != null){
                projects.push(doc.data())
            }
        });

        return {status: 200, body: projects};
    }

    static async get_displayed_projects(){

    }

    static async get_project_by_id(id){

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

}