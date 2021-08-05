import React, { useState, useEffect } from 'react';
import './AlertComponent.css';
function AlertComponent(props) {
    const [modalDisplay, toggleDisplay] = useState('none');
    const openModal = () => {
        toggleDisplay('block');
    }
    const closeModal = () => {
        toggleDisplay('none');
        props.hideError(null);
    }
    useEffect(() => {
        if (props.errorMessage !== null) {
            openModal()
        } else {
            closeModal()
        }
    });

    return (
        <div
            className={"errorMessage alert alert-danger alert-dismissable mt-4"}
            role="alert"
            id="alertPopUp"
            style={{ display: modalDisplay }}
        >
            <div className={"d-flex alertMessage"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill me-2" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
                <span className={"text-left"}>{props.errorMessage}</span>
                <button type="button" className={"btn-close text-right"} data-dismiss="alert" aria-label="Close" onClick={() => closeModal()}>
                </button>
            </div>

        </div>
    )
}

export default AlertComponent