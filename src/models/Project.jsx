import { db } from "../firebase";
import { addDoc, setDoc, collection, doc, updateDoc, getDoc, writeBatch, runTransaction, deleteDoc, query, where, getDocs } from "firebase/firestore";

export default class Project{

    constructor(
        name= '',
        desc='',
        startDate=null,
        endDate=null,
        repo='',
        deploy=''
    ){
        this.name=name;
        this.desc=desc;
        this.startDate = startDate instanceof Date ? startDate : startDate.toDate(); // change to date
        this.endDate = endDate instanceof Date ? endDate : endDate.toDate(); // change to date
        this.repo=repo;
        this.deploy=deploy;
    }

    static async POST_project ( name, desc, startDate,endDate, repo, deploy ) {
        try {
            //create  instance
            const project = new Project( name, desc, startDate,endDate, repo, deploy ); 

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

}