const convertIDtoSmall = (id) => {
    //hash the id to a 2 digit number
    let number = 0;
    for (let i = 0; i < id.length; i++) {
        number += id.charCodeAt(i);
    }
    return number % 100;
};

const convertIDtoCode = (id) => {
    // Hash the id to a number and ensure it's 5 digits
    let number = 0;
    for (let i = 0; i < id.length; i++) {
      number += id.charCodeAt(i);
    }
    
    // Ensure the result is always a 5-digit number
    let fiveDigitCode = (number % 90000) + 10000; // This ensures a range between 10000 and 99999
    return fiveDigitCode;
};

const commonService = {
    handleID: (id) => {
        return convertIDtoSmall(id);
    },
    handleCode: (id) => {
        return convertIDtoCode(id);
    },
};

export default commonService;
