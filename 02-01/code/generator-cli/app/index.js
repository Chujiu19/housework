const generator = require('yeoman-generator')
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
    prompting() {
        return this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'page-name',
                default: this.appname
            }
        ]).then(res => {
            this.answers = res
        })
    }
    writing() {
        const templates = [
            '.editorconfig',
            '.npmrc',
            '.travis.yml',
            'gulpfile.js',
            'LICENSE',
            'package.json',
            'README.md',
            'public/favicon.ico',
            'src/assets/fonts/pages.eot',
            'src/assets/fonts/pages.svg',
            'src/assets/fonts/pages.ttf',
            'src/assets/fonts/pages.woff',
            'src/assets/images/brands.svg',
            'src/assets/images/logo.png',
            'src/assets/scripts/main.js',
            'src/assets/styles/_icons.scss',
            'src/assets/styles/_variables.scss',
            'src/assets/styles/main.scss',
            'src/layouts/basic.html',
            'src/partials/footer.html',
            'src/partials/header.html',
            'src/about.html',
            'src/index.html'
        ]
        templates.forEach(item => {
            this.fs.copyTpl(
                this.templatePath(item),
                this.destinationPath(item),
                this.answers
            )
        })
    }

}