export async function fetchRequest({ url, method, body }) {
    const httpHeaders = {
        method,
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    };
    if (method !== 'GET') httpHeaders.body = JSON.stringify(body);
    console.log(httpHeaders)

    const response = await fetch(url, httpHeaders);
    const data = await response.json();
    return data;
}