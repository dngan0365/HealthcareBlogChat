import jwt
import requests
from fastapi import HTTPException, Depends, Header
from typing import Optional
import os

CLERK_API_KEY = os.getenv("sk_test_xUgDMqHzoQ9skvDGOEcRR6sJm2LgmETFcoEIOoyCe6")
CLERK_ISSUER = "https://stirred-monkfish-90.clerk.accounts.dev"  # Replace with your Clerk issuer URL
CLERK_BASE_URL="https://api.clerk.com"
CLERK_CLIENT_ID = "c3RpcnJlZC1tb25rZmlzaC05MC"  # Derived Client ID

def verify_clerk_token(token: str) -> dict:
    try:
        # Retrieve the public JWKS for Clerk
        jwks_url = f"{CLERK_ISSUER}/.well-known/jwks.json"
        jwks_response = requests.get(jwks_url)
        jwks_response.raise_for_status()
        jwks = jwks_response.json()

        # Decode the token using the JWKS
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = None
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
                break

        if not rsa_key:
            raise HTTPException(status_code=401, detail="Unable to find appropriate key.")

        # Decode the token
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            audience=CLERK_CLIENT_ID,  # Replace with your Clerk client ID
            issuer=CLERK_ISSUER,
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired.")
    except jwt.JWTClaimsError:
        raise HTTPException(status_code=401, detail="Invalid token claims.")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token validation error: {str(e)}")


def get_current_user(authorization: Optional[str] = Header(None)):
    decoded_token = jwt.decode(token, options={"verify_signature": False})
    print(decoded_token)
    if not authorization or not authorization.startswith("Bearer "):
        print(f"Authorization header: {authorization}")  # Log header for debugging
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid.")

    token = authorization.split(" ")[1]
    user_info = verify_clerk_token(token)
    return user_info

def get_user_info(user_id: str):
    headers = {
        "Authorization": f"Bearer {CLERK_API_KEY}",
    }
    response = requests.get(f"{CLERK_BASE_URL}/users/{user_id}", headers=headers)
    response.raise_for_status()
    return response.json()