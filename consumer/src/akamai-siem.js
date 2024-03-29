const EdgeGrid = require('akamai-edgegrid');
const linebreak = "\\n";

const fetchEvents = async function (messageObject, settingsObject) {
    return new Promise(function (resolve, reject) {
        try{
            const authParams = {
                path: settingsObject.edgercFilename,
                section: settingsObject.edgercSection
            }

            const eg = new EdgeGrid(authParams);
            const fetchEventsParams = {
                path: "/siem/v1/configs/" + settingsObject.configsIds + "?limit=" + messageObject.eventsPerJob + "&from=" + messageObject.from + "&to=" + messageObject.to,
                method: "GET",
                headers: {
                    Accept: "application/json"
                }
            };

            eg.auth(fetchEventsParams);
            eg.send(function (error, response, body) {
                try{
                    if(error)
                        return resolve(null);

                    let eventsList = [];
                    const eventsBuffer = body.split(linebreak);

                    eventsBuffer.forEach((item, index) => {
                        if (item.length > 0 && index < (eventsBuffer.length - 1)) {
                            let eventObject = {
                                key: messageObject.job + "-" + index,
                                value: item.replace("'", "").replace(/\\/g, "")
                            };

                            eventsList.push(eventObject);
                        }
                    });

                    const eventsObject = {
                        "job": messageObject.job,
                        "events": eventsList
                    };

                    return resolve(eventsObject);
                }
                catch(error){
                    return reject(error);
                }
            });
        }
        catch(error){
            return reject(error);
        }
    });
};

module.exports = { fetchEvents };