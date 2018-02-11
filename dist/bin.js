"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const execa_1 = __importDefault(require("execa"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const path_1 = __importDefault(require("path"));
const tmpl = x => path_1.default.join('_templates', x);
const main = () => __awaiter(this, void 0, void 0, function* () {
    const { red, green, yellow } = chalk_1.default;
    const args = process.argv.slice(2);
    console.log('hello hygen-add', args);
    if (args.length !== 1) {
        console.log('please specify a package to add');
        process.exit(1);
    }
    const [pkg] = args;
    const spinner = ora_1.default(`Adding: ${pkg}`).start();
    try {
        const pkgName = `hygen-${pkg}`;
        yield execa_1.default.shell(`${path_1.default.join(__dirname, '../node_modules/.bin/')}yarn add --dev ${pkgName}`);
        const templatePath = path_1.default.join('./node_modules', pkgName, '_templates');
        const exists = yield fs_extra_1.default.pathExists(templatePath);
        yield fs_extra_1.default.mkdirp('_templates');
        // this copies or conditionally namespaces the generators with a dash '-'
        // pkg-generator
        console.log('');
        for (const g of yield fs_extra_1.default.readdir(templatePath)) {
            const wantedTargetPath = tmpl(g);
            const sourcePath = path_1.default.join(templatePath, g);
            const namespaced = `${pkg}-${g}`;
            if (yield fs_extra_1.default.pathExists(wantedTargetPath)) {
                spinner.stop();
                if (yield inquirer_1.default
                    .prompt([
                    {
                        message: `'${g}' already exists. Namespace it to '${namespaced}'? (y/N): `,
                        name: 'namespace',
                        prefix: '      🤔 :',
                        type: 'confirm'
                    }
                ])
                    .then(({ namespace }) => namespace)) {
                    yield fs_extra_1.default.copy(sourcePath, tmpl(namespaced), {
                        recursive: true
                    });
                    console.log(green(`   Added: ${namespaced} (renamed from ${g})`));
                }
                else {
                    console.log(yellow(` Skipped: ${g}`));
                }
            }
            else {
                yield fs_extra_1.default.copy(sourcePath, wantedTargetPath, {
                    recursive: true
                });
                console.log(green(`   Added: ${g}`));
            }
        }
    }
    catch (ex) {
        console.log(red(`\n\nCan't add ${pkg}:\n\n`), ex);
    }
    spinner.stop();
});
main();
//# sourceMappingURL=bin.js.map