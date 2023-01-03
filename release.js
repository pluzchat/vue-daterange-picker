const { execSync } = require('child_process');
const axios = require('axios');
const { name, version } = require('./package.json');

function log(...args) {
    console.log('[Xuất bản SDK]', ...args);
}

function logError(...args) {
    console.error('[Xuất bản SDK]', ...args);
}

(async () => {
    log(`Kiểm tra nếu ${name}@${version} cần xuất bản`);

    const packageUrl = `https://registry.npmjs.org/${name}/${version}`;
    // npm commands output a bunch of garbage in the edge cases,
    // and require sending semi-validated strings to the command line,
    // so let's just use good old http.
    const { status } = await axios.get(packageUrl, {
        validateStatus: (status) => true // we literally just want the status so any status is valid
    });

    if (status === 200) {
        log('Phiên bản đã tồn tại trên npm, thoát');
    } else if (status === 404) {
        log('Yêu cầu xuất bản, đang xây dựng gói ...');
        try {
            execSync('npm run build', { stdio: 'pipe' });
            log('Xây dựng gói thành công, đang xuất bản')
            execSync('npm publish --access public', { stdio: 'pipe' });
            log(`Đã xuất bản phiên bản ${version} tới npm`);
        } catch (err) {
            console.error(String(err));
            logError('Có lỗi xảy ra, chi tiết lỗi xem bên trên');
            process.exitCode = 1;
        }
    } else {
        logError(`Lỗi không xác định vui lòng thử lại sau`);
        process.exitCode = 1;
    }
})();