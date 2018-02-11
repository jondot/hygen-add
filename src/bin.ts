import chalk from 'chalk'
import execa from 'execa'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import L from 'lodash'
import ora from 'ora'
import path from 'path'

const tmpl = x => path.join('_templates', x)

const main = async () => {
  const { red, green, yellow } = chalk
  const args = process.argv.slice(2)
  console.log('hello hygen-add', args)
  if (args.length !== 1) {
    console.log('please specify a package to add')
    process.exit(1)
  }
  const [pkg] = args
  const spinner = ora(`Adding: ${pkg}`).start()
  try {
    const pkgName = `hygen-${pkg}`
    await execa.shell(
      `${path.join(
        __dirname,
        '../node_modules/.bin/'
      )}yarn add --dev ${pkgName}`
    )
    const templatePath = path.join('./node_modules', pkgName, '_templates')
    const exists = await fs.pathExists(templatePath)
    await fs.mkdirp('_templates')

    // this copies or conditionally namespaces the generators with a dash '-'
    // pkg-generator
    console.log('')
    for (const g of await fs.readdir(templatePath)) {
      const wantedTargetPath = tmpl(g)
      const sourcePath = path.join(templatePath, g)
      const namespaced = `${pkg}-${g}`

      if (await fs.pathExists(wantedTargetPath)) {
        spinner.stop()
        if (
          await inquirer
            .prompt([
              {
                message: `'${g}' already exists. Namespace it to '${namespaced}'? (y/N): `,
                name: 'namespace',
                prefix: '      🤔 :',
                type: 'confirm'
              }
            ])
            .then(({ namespace }) => namespace)
        ) {
          await fs.copy(sourcePath, tmpl(namespaced), {
            recursive: true
          })
          console.log(green(`   Added: ${namespaced} (renamed from ${g})`))
        } else {
          console.log(yellow(` Skipped: ${g}`))
        }
      } else {
        await fs.copy(sourcePath, wantedTargetPath, {
          recursive: true
        })
        console.log(green(`   Added: ${g}`))
      }
    }
  } catch (ex) {
    console.log(red(`\n\nCan't add ${pkg}:\n\n`), ex)
  }
  spinner.stop()
}

main()
