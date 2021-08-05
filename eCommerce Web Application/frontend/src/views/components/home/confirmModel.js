import axios from "axios";
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from "../../context/AuthContext";

function ConfirmModel(props) {
   //const { getLoggedIn } = useContext(AuthContext);
   const {logState} = useContext(AuthContext);
   const [loggedIn, getLoggedIn] = logState;
   //const [getLoggedIn] = logState;
    const [modalDisplay, toggleDisplay] = useState('none');
    const openModal = () => {
        toggleDisplay('block');
    }
    const closeModal = () => {
        toggleDisplay('none');
    }
    useEffect(() => {
        if (props.show) {
            openModal()
        } else {
            closeModal()
        }
    });
    const handleLogOut = async () => {
        await axios.get("http://localhost:5000/account/api/logout")
            .then(function (response) {
                if (response.status === 200) {
                    getLoggedIn();
                    //getLoggedIn();
                    window.location.href = "/main";
                }
        })
    }

    return (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: modalDisplay }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm to Log out</h5>
                        <button type="button" className="btn-close text-right" data-dismiss="alert" aria-label="Close" onClick={props.handleClose}>
                            {/* <span aria-hidden="true">&times;</span> */}
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure to sign out?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={props.handleClose}>No</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleLogOut}>Yes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModel