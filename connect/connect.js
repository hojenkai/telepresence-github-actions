const core = require('@actions/core')
const exec = require('@actions/exec');
const io = require('@actions/io');

const telepresenceConnect = async function(){
    try {
        await createClientConfigFile(core.getInput('client_values_file'));
    } catch(err) {
        core.setFailed(err);
        return;
    }

    await createClientConfigFile();

    try {
        await exec.exec('telepresence', ['connect']);
        core.saveState("telepresence_connected", true)
    } catch (error) {
        core.setFailed(error.message);
    }
}

const createClientConfigFile = async function(values_file_path) {
    if (!values_file_path) {
        return;
    }
    if (!values_file_path.endsWith('.yaml')  && !values_file_path.endsWith('.yml')) {
        throw new Error('client_values_file values file must be a yaml file.');
    }

    await exec.exec('cat', [values_file_path]);
    await exec.exec('cp', [values_file_path, '~/.config/telepresence/config.yml']);
    // await io.cp(values_file_path, '$HOME/.config/telepresence/config.yml');
}

telepresenceConnect();
