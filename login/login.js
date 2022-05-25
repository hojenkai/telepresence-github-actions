const core = require('@actions/core')
const exec = require('@actions/exec');
const AmbassadorClient = require('../ambassador/api-client');

const telepresenceLogin = async function(){
    const apiKey = core.getInput('telepresence_api_key');
    console.log('apikey', apiKey);
    if (!apiKey) {
        core.setFailed('telepresence_api_key is required');
        return;
    }

    const ambassadorClient = new AmbassadorClient(apiKey);
    const keyValid = await ambassadorClient.isApiKeyValid();
    if (!keyValid) {
        console.log('invalid key',apiKey, core.setFailed)
        // core.setFailed('telepresence_api_key is expired or invalid');
        core.setFailed('telepresence_api_key is expired or invalid');
        return;
    }

    try {
        await exec.exec('telepresence', ['login', '--apikey', apiKey]);
        core.saveState('telepresence_session_created', true);
    } catch (error) {
        core.setFailed(error.message);
    }
}


telepresenceLogin();
