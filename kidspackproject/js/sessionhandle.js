function createSession(id, email, role) {
    localStorage.setItem('userid', id);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
}

function deleteSession() {
    localStorage.clear();
}


function checkSession() {
    let sessionuserid = localStorage.getItem('userid');
    let sessionEmail = localStorage.getItem('email');
    console.log(sessionEmail);

    if (sessionuserid == null && sessionEmail == null) {
        console.log("you are logged out! to continue log in again");
        return false;
    }
    else {
        return true;
    }

}

function getUserSessionData() {
    if (checkSession()) {
        let sessionuserid = localStorage.getItem('userid');
        let sessionEmail = localStorage.getItem('email');
        let sessionrole = localStorage.getItem('role');

        return { userid: sessionuserid, useremail: sessionEmail, userrole: sessionrole };
    }

    return null;
}