// Function to clean phone number format

const CleanPhoneNumber = (phoneNumber) => {
  // Step 1: Remove any non-numeric characters (except for '+')
  let cleanedNumber = phoneNumber.replace(/[^0-9+]/g, '');
  
  // Step 2: Ensure the number starts with +601 (for Malaysian numbers)
  if (cleanedNumber.startsWith('0')) {
    // Replace '0' at the beginning with '0'
    cleanedNumber = cleanedNumber.replace(/^0/, '+60');
  } else if (cleanedNumber.startsWith('60')) {
    // Replace '60' at the beginning with '+60'
    cleanedNumber = cleanedNumber.replace(/^60/, '+60');
  };

  return cleanedNumber;
}

export default CleanPhoneNumber;