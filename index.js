const exec = require('@actions/exec');
const core = require('@actions/core');
const glob = require('@actions/glob');

const main = async () => {

    const globber = await glob.create(__dirname + '/**/*.csproj', { followSymbolicLinks: false })
    const files = await globber.glob()

    const projectPath = files[0];

    let args = ['run', '-c', 'Release', '--project', projectPath, '--'];

    var env = process.env;

    Object.keys(env).forEach(function (envKey) {
        if (envKey.startsWith("INPUT_")) {
            let key = `-${envKey.replace("INPUT_", "").toLowerCase()}`;
            args.push(key);
            args.push(env[envKey]);
        }
    });




    await exec.exec('dotnet', args);
};

main().catch(err => {
    console.error(err);
    console.error(err.stack);
    process.exit(-1);
})