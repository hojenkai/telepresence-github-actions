const core = require('@actions/core')
const exec = require('@actions/exec');

const telepresenceIntercept = async function(){
    try {
        const service_name = core.getInput('service_name');
        const service_port = core.getInput('service_port');
        const namespace = core.getInput('namespace');
        const http_header = core.getInput('http_header');
        const env_file = core.getInput('env_file');
        const ingress_host = core.getInput('ingress_host');
        const ingress_port = core.getInput('ingress_port');
        const ingress_tls = core.getInput('ingress_tls');
        const ingress_l5 = core.getInput('ingress_l5');
        const post_intercept_delay = core.getInput('post_intercept_delay');
        const parameters = ['intercept', service_name, '--port', service_port, '--ingress-host', ingress_host,
            '--ingress-port', ingress_port, '--ingress-l5', ingress_l5, '-n', namespace, `--http-header=${http_header}`];
        if (env_file && env_file.length !== 0){
            parameters.push('-e');
            parameters.push(env_file);
        }
        if (ingress_tls)
            parameters.push('--ingress-tls')


        let delay = 0;
        if (post_intercept_delay) {
            try {
                delay = parseInt(post_intercept_delay);
            } catch(err) {
                core.notice('Error parsing post_intercept_delay. ' + err.message);
            }
        }

        await exec.exec('telepresence', parameters);
        core.saveState('telepresence_service_intercepted', true);

        if ( delay > 0 ) {
            await exec.exec('sleep', [delay]);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}


telepresenceIntercept();
