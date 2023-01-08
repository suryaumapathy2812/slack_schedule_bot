const dinnerMessageTemplate = (list) => {

    let yesList = [];
    let mdYesList = "";
    let noList = [];
    let mdNoList = "";

    if (list) {
        console.log("list ==========", list)

        yesList = list
            .filter((option) => option["userResponse"] === "yes")
            .map((option) => {
                return "@" + option["username"]
            });

        mdYesList = yesList
            .toString()
            .replace(",", ", @");


        noList = list
            .filter((option) => option["userResponse"] === "no")
            .map((option) => {
                return "@" + option["username"]
            });

        mdNoList = noList
            .toString()
            .replace(",", ", @");
    }

    console.log("mdYesList ===========", mdYesList);
    console.log("mdNoList ==========", mdNoList)

    return [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Are you staying back for dinner :dinner: today?*"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "plain_text",
                "text": "\n  "
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "This Poll is currently *Open*"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Yes*  $$input_1"
            },
            "accessory": {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "Yes"
                },
                "value": "yes"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*No*  $$input_2"
            },
            "accessory": {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "No"
                },
                "value": "no"
            }
        }
    ]
}

module.exports = { dinnerMessageTemplate }