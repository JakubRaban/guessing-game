export const fetchJson = (input: RequestInfo, init?: RequestInit | undefined): Promise<any> =>
  fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  })
    .then((res) => res.json())

