export async function fetchRequest({ url, method }) {
    const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        }
    });
    const data = await response.json();
    return data;
}