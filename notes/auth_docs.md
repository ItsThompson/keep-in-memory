# Misc
## Setting "Access-Control-Allow-Origin" in API Gateway
- two stages: dev and prod
- each stage has a stage variable called originUrl with the respective frontend URL
## Frontend (localhost and production)
### localhost
- localhost uses a proxy to the backend API
**Before Proxy**: Cross-site + insecure
```plaintext
Frontend: http://localhost:3000
API: AWS API Gateway URL
```

**After Proxy (via Next.js rewrites)**: Cookie comes from the same origin.
```plaintext
Frontend: http://localhost:3000

API: /api/* (proxied to backend)
```
✅ It’s not cross-site anymore
✅ No need for HTTPS in dev
✅ Cookie gets accepted even with Secure (some browsers loosen this for localhost)
#### proxy setup
1. checks if environment is development
2. if so, sets up a proxy to the dev stage API (devstage api allows for localhost:3000 route)
## Production
- production uses the actual backend API URL
- Two env files for dev and prod (.env.development and .env.production)
    - .env.development `NEXT_PUBLIC_API_URL=/api`
    - .env.production `NEXT_PUBLIC_API_URL=https://yvhgqsmtn8.execute-api.eu-west-2.amazonaws.com/prod`
        - production stage api
# Access Token

- JWT (JSON Web Token) - Contains user ID and expiration time - Short-lived (e.g., 15 minutes)
  > [!NOTE]
  > Figure out how to store expiration time in the JWT.

# Issue Token + Refresh Cookie

- Long, random, unguessable string -> random UUID
- Frontend: Saved as a HttpOnly, Secure, SameSite Cookie
- Backend: Stored in a database (Same row as player_id)

## Backend Logic

```python
refresh_cookie = (
    f"refreshToken={refresh_token}; "
    f"HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800"
)
...

return {
    "statusCode": 200,
    "headers": {
        "Set-Cookie": refresh_cookie,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://your-frontend-domain.com", # CANNOT USE '*' for Set-Cookie
        "Access-Control-Allow-Credentials": "true"
    },
    "body": json.dumps({
        "accessToken": access_token
    }),
}
```

# Refresh POST request

## Frontend Logic

```ts
const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/refresh`, {
  method: "POST",
  credentials: "include", // Include refresh token cookie
});
if (!response.ok) {
  throw new Error("Failed to refresh token");
}
const data = await response.json();
const accessToken = data.accessToken;
// Use the access token for subsequent requests
```

## Backend Logic

1. Validate refresh token against token stored in database.
2. Generate a new access token.

```python
refresh_cookie = (
    f"refreshToken={refresh_token}; "
    f"HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800"
)
...

return {
    "statusCode": 200,
    "headers": {
        "Set-Cookie": refresh_cookie,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://your-frontend-domain.com", # CANNOT USE '*' for Set-Cookie
        "Access-Control-Allow-Credentials": "true"
    },
    "body": json.dumps({
        "accessToken": access_token
    }),
}
```

# Access Restricted Routes

```ts
fetch("/api/protected-route", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

# Token Expiry

1. Frontend sends request with expired access token.
2. Backend responds with 401 Unauthorized.
3. Frontend catches the error and calls the refresh endpoint.
4. Backend validates the refresh token (Checks dynamoDB).
   4.1. Valid refresh token: issues a new access token.
   4.2. Invalid refresh token: Responds with 401 Unauthorized.
5. Frontend retries the original request with the new access token or redirects to login.

# Logout

## Frontend Logic

1. Clicks the logout button.
2. Clears access token from memory.
3. Sends a POST request to the backend to invalidate the refresh token and clear the cookie.

```ts
const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/logout`, {
  method: "POST",
  credentials: "include", // Include refresh token cookie
});

if (!response.ok) {
  throw new Error("Failed to log out");
}
```

## Backend Logic

1. Removes the refresh token from the database.
2. Clears the refresh token cookie.

```python
refresh_cookie = (
    f"refreshToken=; "
    f"HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800"
)

return {
    "statusCode": 200,
    "headers": {
        "Set-Cookie": refresh_cookie,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://your-frontend-domain.com", # CANNOT USE '*' for Set-Cookie
        "Access-Control-Allow-Credentials": "true"
    },
    "body": json.dumps({
        "message": "Logged out successfully"
    }),
}
```
