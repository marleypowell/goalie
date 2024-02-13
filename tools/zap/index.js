const core = require('@actions/core');
const exec = require('@actions/exec');
const common = require('@zaproxy/actions-common-scans');

// Default file names
const jsonReportName = 'report_json.json';
const mdReportName = 'report_md.md';
const htmlReportName = 'report_html.html';

async function run() {
  try {
    const workspace = process.env.GITHUB_WORKSPACE;
    const currentRunnerID = process.env.GITHUB_RUN_ID;
    const repoName = process.env.GITHUB_REPOSITORY;

    const token = core.getInput('token');
    const dockerName = core.getInput('docker_name');
    const issueTitle = core.getInput('issue_title');
    const failAction = core.getBooleanInput('fail_action');
    const createIssue = core.getBooleanInput('allow_issue_writing');
    const automationFile = core.getInput('automation_file', { required: true });

    console.log('starting the program');
    console.log('github run id :' + currentRunnerID);

    await exec.exec(`docker pull ${dockerName} -q`);

    const dockerArguments = [
      'run',
      '--user',
      'root',
      '-v',
      `${workspace}/tools/zap:/zap/wrk/:rw`,
      '-v',
      `${workspace}/tools/zap/reports:/home/zap/reports/:rw`,
      '--network=host',
      '-t',
      dockerName,
    ];
    const zapArguments = ['zap.sh', '-cmd', '-autorun', `/zap/wrk/${automationFile}`];

    try {
      await exec.exec('docker', [...dockerArguments, ...zapArguments]);
    } catch (err) {
      if (err.toString().includes('exit code 3')) {
        core.setFailed('failed to scan the target: ' + err.toString());
        return;
      }

      if ((err.toString().includes('exit code 2') || err.toString().includes('exit code 1')) && failAction) {
        console.log(`[info] By default ZAP Docker container will fail if it identifies any alerts during the scan!`);
        core.setFailed(
          'Scan action failed as ZAP has identified alerts, starting to analyze the results. ' + err.toString()
        );
      } else {
        console.log('Scanning process completed, starting to analyze the results!');
      }
    }

    await common.main.processReport(
      token,
      `${workspace}/tools/zap/reports`,
      [],
      currentRunnerID,
      issueTitle,
      repoName,
      createIssue
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
