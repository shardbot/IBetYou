type Type = 'counter-bettor' | 'judge';

export const sendEmail = async (receiverEmail: string, betAddress: string | any, type: Type) => {
  // TODO move link url to the env
  const response = await fetch('http://localhost:3001/api/invitation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: receiverEmail,
      betAddress,
      type
    })
  });

  if (response.status >= 400 && response.status < 600) {
    throw new Error('Bad response from server');
  }

  return response;
};
