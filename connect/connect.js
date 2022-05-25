const core = require('@actions/core')
const exec = require('@actions/exec');
const fs = require("fs");

const kubeconfigPath = "/opt/kubeconfig";

const telepresenceConnect = async function(){
    const kubeconfigFileExists = await kubeConfigExists();
    if (!kubeconfigFileExists) {
        core.setFailed(`${kubeconfigPath} does not exists or it is empty`);
        return;
    }

    try {
        await exec.exec('telepresence', ['connect']);
        core.saveState("telepresence_connected", true)
    } catch (error) {
        core.setFailed(error.message);
    }
}

const kubeConfigExists = async function() {
    try {
        const stats = await fs.promises.stat(kubeconfigPath);
        return stats.isFile() && stats.size > 0;
    } catch(err) {
        if (err.code === 'ENOENT') {
            return false;
        }
        throw err;
    }
}

telepresenceConnect();
