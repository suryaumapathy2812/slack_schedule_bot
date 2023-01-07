const dinnerMessageTemplate = (list) => {

    console.log("list ==========", list)

    const yesList = list
        .filter((option) => option["userResponse"] === "yes")
        .map((option) => {
            return option["username"]
        });

    const mdYesList = yesList
        .toString()
        .replace(",", ", @");


    const noList = list
        .filter((option) => option["userResponse"] === "no")
        .map((option) => {
            return option["username"]
        });

    const mdNoList = noList
        .toString()
        .replace(",", ", @");

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
                "text": "\n"
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
                "text": `*Yes (${yesList.length}) *  \n  ${mdYesList}`
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
                "text": `*No (${noList.length}) * \n  ${mdNoList}`
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