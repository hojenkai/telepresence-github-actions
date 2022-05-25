const core = require('@actions/core')
const exec = require('@actions/exec');
const AmbassadorClient = require('../ambassador-client').AmbassadorClient;

const telepresenceLogin = async function(){
    const apiKey = core.getInput('telepresence_api_key');
    if (!apiKey) {
        core.setFailed('telepresence_api_key is required');
        return;
    }

    const ambassadorClient = new AmbassadorClient(apiKey);
    const keyValid = await ambassadorClient.isApiKeyValid();
    core.notice("validation result " + keyValid);
    if (!keyValid) {
        core.setFailed('telepresence_api_key is expired or invalid');
        return;
    }

    try {
        await exec.exec('telepresence', ['login', '--apikey', apiKey]);
    } catch (error) {
        core.setFailed(error.message);
    }
}


telepresenceLogin();
