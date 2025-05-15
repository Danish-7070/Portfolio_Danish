export const  inputDateFormat=(isoDate) => {
    // Create a new Date object from the ISO date string
    const date = new Date(isoDate);
    
    // Extract year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    // Return the formatted date string
    return `${year}-${month}-${day}`;
}