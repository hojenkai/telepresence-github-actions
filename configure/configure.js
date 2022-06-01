const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const configure = require('../src/configure');
const installTelepresence = require('../src/install');
const cache = require('@actions/cache');

const telepresenceConfiguring = async function () {
    const isInstalled = await installTelepresence.telepresenceInstall();
    if(!isInstalled)
        return;

    const path = configure.getTelepresenceConfigPath();
    const telepresenceConfigDir = [path];

    try {
        await io.mkdirP(path);
        await cache.restoreCache(telepresenceConfigDir, configure.TELEPRESENCE_CACHE_KEY);
    } catch (error) {
        core.warning(`Unable to find the telepresence id: ${error}`);
    }
    try {
        await exec.exec(`${installTelepresence.TP_PATH}/telepresence`, ['connect']);
    } catch (error) {
        core.setFailed(error.message);
        return;
    }
    try {
        const cacheKey = await cache.saveCache(telepresenceConfigDir, configure.TELEPRESENCE_CACHE_KEY);
        if (!cacheKey)
            core.setFailed('Unable to save the telepresence key cache');
    } catch (error) {
        core.setFailed(error.message);
    }
}


telepresenceConfiguring();