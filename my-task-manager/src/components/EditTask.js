import React, { useState } from 'react'
import {db} from '../firebase.config'
import { doc, updateDoc } from 'firebase/firestore';

const EditTask = ({task, id}) => {

    const [updatedTask, setUpdatedTask] = useState([task])

    const updateTask = async (e) => {
        e.preventDefault();

        try {
            const taskDocument = doc(db, "tasks", id)
            await updateDoc(taskDocument, {
                task: updatedTask,
                isChecked: false
            })
            window.location.reload()
        } catch (err) {
            console.log(err)
        }
    }
    
    return (
        <>
        {/* Button trigger modal */}
        <button 
            type="button" 
            className="btn btn-primary" 
            data-bs-toggle="modal" 
            data-bs-target={`#id${id}`}
        >
            Edit Task
        </button>

        {/* Modal */}
        <div className="modal fade" id={`id${id}`} tabIndex="-1" aria-labelledby="updateTaskLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <form className="d-flex" >                    
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="updateTaskLabel">Update Task</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">

                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Task name"
                                            defaultValue={updatedTask}
                                            onChange={e => setUpdatedTask(e.target.value)}
                                        />
                                    
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        onClick={e => updateTask(e)}
                                    >Confirm</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
        </>

    )
}

export default EditTask