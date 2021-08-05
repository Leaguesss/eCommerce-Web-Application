import React, { useContext, useState } from 'react';
import AuthContext from "../../context/AuthContext";

function PageTitle(props) {
    const { logState, userId } = useContext(AuthContext);
    const [loggedIn, getLoggedIn] = logState;
    const [user, setUser] = userId;   

    return (
        <>
            <div className="border bg-white shadow p-3" style={{ borderRadius: "15px" }}>
                <div className="text-success" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#ffc107" className="bi bi-cart-check-fill" viewBox="0 0 16 16">
                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1.646-7.646-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708z" />
                    </svg>
                    {' '}
                    <span className="fs-1" style={{ marginLeft: '2%' }}><strong>Checkout form</strong></span>
                </div>
                <hr/>

                {loggedIn === false
                    &&
                    <>
                    <div className="container card px-0 my-5" style={{ width: '60%' }}>
                            <h5 className="card-header text-danger">
                                <div className="fs-3 my-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                    </svg>
                                    {' '}
                                    <span>No account logged in</span>
                                </div>
                            </h5>
                            <div className="card-body">
                                <h5 className="card-title">Error</h5>
                                <p className="card-text">
                                    <i>You need to log in first!</i>
                                </p>
                            </div>
                        </div>
                    </>
                }
                {loggedIn === true
                    &&
                    <div className="text-center">
                        <h5 className="text-secondary" style={{ display: "inline-block" }}>
                            <i>The following table contains what you have selected</i>
                        </h5>
                    </div>
                }
            </div>
        </>
    );
}
export default PageTitle;