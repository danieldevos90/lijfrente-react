import argparse
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/adwords"]

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--client_id", required=True)
    p.add_argument("--client_secret", required=True)
    args = p.parse_args()

    client_config = {
        "installed": {
            "client_id": args.client_id,
            "client_secret": args.client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": ["http://localhost", "urn:ietf:wg:oauth:2.0:oob"],
        }
    }

    flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
    creds = flow.run_local_server(port=0, prompt="consent")
    print("refresh_token=", creds.refresh_token)

if __name__ == "__main__":
    main()
