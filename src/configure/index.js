const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const cache = require('@actions/cache');

exports.getTelepresenceConfigPath = () => {
    switch (process.platform) {
        case "darwin":
            return '/home/runner/Library/Application\\ Support/telepresence';
        case "linux":
            return '/home/runner/.config/telepresence';
        default:
            core.setFailed(`The platform ${process.platform} is not supported yet`);
            return null;
    }
};

exports.getConfiguration = async () => {
    const path = this.getTelepresenceConfigPath();
    try {
        await io.mkdirP(path);
        const cacheid = await cache.restoreCache([path], this.TELEPRESENCE_CACHE_KEY,)
        if (!cacheid){
            core.setFailed('Unable to find a telepresence install id stored');
            return false;
        }

    } catch (error) {
        core.setFailed(error);
        return false;
    }
    return true;
};

exports.createClientConfigFile = async function(values_file_path) {
    if (!values_file_path) {
        return;
    }
    if (!values_file_path.endsWith('.yaml')  && !values_file_path.endsWith('.yml')) {
        throw new Error('client_values_file values file must be a yaml file.');
    }

    const telepresenceConfigDir = this.getTelepresenceConfigPath();
    await io.mkdirP(telepresenceConfigDir);
    await exec.exec('cp', [values_file_path, telepresenceConfigDir + '/config.yml']);
}

exports.TELEPRESENCE_ID_STATE = 'telepresence-id-state';
exports.TELEPRESENCE_ID_SAVES = 'telepresence-saves';
exports.TELEPRESENCE_ID_SAVED = 'telepresence-saved';
exports.TELEPRESENCE_CACHE_KEY = 'telepresence_cache_key';


