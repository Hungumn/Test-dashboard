export function isEmailValid(email) {
    // return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

export function removeSpecialCharacter(str) {
    return str.replace(/[`~!@#$%^&*()｜|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
}

export function removeSpacesBetweenWords(str) {
    return str.replace(/\s+/g, "");
}
