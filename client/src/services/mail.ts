type Type = 'counter-bettor' | 'judge';
type JudgeType = 'bettor-judge' | 'counter-bettor-judge';

export const sendEmail = async (
  receiverEmail: string,
  betAddress: string | any,
  type: Type,
  judgeType: JudgeType | null
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: receiverEmail,
      betAddress,
      type,
      judgeType
    })
  });

  if (response.status >= 400 && response.status < 600) {
    throw new Error('Bad response from server');
  }

  return response;
};
