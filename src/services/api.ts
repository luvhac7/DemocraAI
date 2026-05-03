export const simulateElection = async (data: any) => {
  const response = await fetch("/api/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getVoterInfo = async (params: { country: string; age?: number; location?: string }) => {
  const query = new URLSearchParams(params as any).toString();
  const response = await fetch(`/api/voter-info?${query}`);
  return response.json();
};

export const getTimeline = async (country: string, type: string) => {
  const response = await fetch(`/api/timeline?country=${country}&type=${type}`);
  return response.json();
};
