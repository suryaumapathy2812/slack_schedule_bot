import slack
import os
from pathlib import Path
from dotenv import load_dotenv


env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

client = slack.WebClient(token=os.environ['SLACK_TOKEN'])

client.chat_postMessage(
    channel='#slack_cli_test_bot',
    text='Are you staying back for dinner today?',
    blocks=[
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Yes"
                    },
                    "value": "yes"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "No"
                    },
                    "value": "no"
                }
            ]
        }
    ]
)
