const API_URL = "http://localhost:8000/api"; // Updated to use the /api prefix you configured earlier

function getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Login failed");
    }
    return res.json();
}

export async function register(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Registration failed");
    }
    return res.json();
}

export async function addWebsite(url: string) {
    const res = await fetch(`${API_URL}/websites/`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            ...getAuthHeader()
        },
        body: JSON.stringify({ url }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to add website");
    }
    return res.json();
}

export async function getWebsite(id: string) {
    const res = await fetch(`${API_URL}/websites/${id}`, {
        method: "GET",
        headers: getAuthHeader(),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to get website");
    }
    return res.json();
}

export async function verifyWebsite(id: string) {
    const res = await fetch(`${API_URL}/websites/${id}/verification/verify`, {
        method: "POST",
        headers: getAuthHeader(),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to verify website");
    }
    return res.json();
}

export async function changeVerificationMethod(id: string, method: string) {
    const res = await fetch(`${API_URL}/websites/${id}/verification/method`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            ...getAuthHeader()
        },
        body: JSON.stringify({ method }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to change method");
    }
    return res.json();
}

export async function rotateVerificationToken(id: string) {
    const res = await fetch(`${API_URL}/websites/${id}/verification/rotate`, {
        method: "POST",
        headers: getAuthHeader(),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to rotate token");
    }
    return res.json();
}

export async function getWebsites() {
    const res = await fetch(`${API_URL}/websites/`, {
        method: "GET",
        headers: getAuthHeader(),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to list websites");
    }
    return res.json();
}
