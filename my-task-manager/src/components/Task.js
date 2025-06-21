import React, {useEffect, useState} from 'react'
import {db} from '../firebase.config'
import {addDoc, collection, deleteDoc, doc, getDocs, orderBy, runTransaction, query, Timestamp, serverTimestamp} from 'firebase/firestore'
import EditTask from './EditTask'

const Task = () => {

    const [tasks, setTasks] = useState([]);
    const [createTask, setCreateTask] = useState("")
    const [checked, setChecked] = useState([]);
    const collectionRef = collection(db, 'tasks')

    useEffect( () => {
        const getTasks = async () => {

            const q = query(collectionRef, orderBy('timestamp'))

            await getDocs(q).then((task) => {
                let tasksData = task.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setTasks(tasksData)
                setChecked(tasksData)
        }).catch((err) => {
            console.log(err);
        })
        }
        getTasks();
    }, [])

    //Add Task Handler
    const SubmitTask = async (e) => {
        e.preventDefault();
        try {
            await addDoc (collectionRef, {
                task: createTask,
                isChecked: false,
                timestamp: serverTimestamp( )
            })
            window.location.reload()
        } catch (err) {
            console.log(err);
        }
        console.log(createTask)
    }

    const deleteTask = async (id) => {

        try {
            const confirmed = window.confirm("Are you sure you want to delete this task?")
            if (!confirmed) return;
            const documentRef = doc(db, "tasks", id);
            await deleteDoc(documentRef)
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    const checkBoxHandler = async (event) => {
        setChecked(state => {
            const index = state.findIndex(checkBox => checkBox.id.toString() === event.target.name);

            let newState = state.slice()

            newState.splice(index, 1, {
                ...state[index],
                isChecked: !state[index]?.isChecked
            })
            setTasks(newState)
            return newState
        })

        // Persisting the check value
        try {
            const docRef = doc(db, "tasks", event.target.name)

            await runTransaction(db, async (transaction) => {
                const taskDoc = await transaction.get(docRef)
                if (!taskDoc.exists()) {
                    throw "Document Does Not Exist!"
                }
                const newValue = !taskDoc.data().isChecked
                transaction.update(docRef, {isChecked: newValue})
            })
            console.log("Task Checked Successfully")
        } catch (err) {
            console.log("Failed to check task.", err)
        }
    }

    console.log("tasks", tasks);
    return (
        <>
            <div className="container">
                <div className="row col-md-12">
                    <div className="card card-white">
                        <div className="card-body">
                            <h1>Task Manager</h1>
                            {/* Button trigger modal */}
                            <button type="button" className="btn btn-primary " data-bs-toggle="modal" data-bs-target="#addTask">
                                Add Tasks
                            </button>

                            {tasks.map(({ task, id, isChecked, timestamp }) =>
                            <div className="todo-list" key={id}>
                                <div className="todo-item">
                                    <hr />
                                    <span className={`${isChecked === true ? 'done' : ''}`}>
                                        <div className="checker">
                                            <span>
                                                <input 
                                                    type="checkbox" 
                                                    defaultChecked={isChecked}
                                                    onChange={(event) => checkBoxHandler
                                                    (event, task)}
                                                    name={id}
                                                />
                                            </span>
                                        </div>
                                        &nbsp;{task} <br />
                                        <i>{new Date(timestamp.seconds * 1000).toLocaleString() }</i>
                                    </span>
                                    <span className="float-end mx-3">
                                        <EditTask task={task} id={id} />
                                    </span>
                                    
                                    <button 
                                        type="button" 
                                        className="btn btn-danger float-end"
                                        onClick={() => deleteTask(id)}
                                    >Delete</button>
                                </div>
                            </div>
                            )}



                        </div>
                    </div>
                </div>
            </div>
            
            
            {/*Modal */}
            <div className="modal fade" id="addTask" tabIndex="-1" aria-labelledby="addTaskLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <form onSubmit={SubmitTask} className="d-flex" >                    
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addTaskLabel">Add New Task</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Task name"
                                        onChange={e => setCreateTask(e.target.value)}
                                    />
                                
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Add</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    ) 
}

export default Task