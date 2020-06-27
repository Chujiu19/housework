#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs')

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Project name?'
  }
])
  .then(anwsers => {
    const tmplDir = path.join(__dirname, 'templates')
    const destDir = process.cwd()
    function rd(dir, des) {
      fs.readdir(dir, {
        withFileTypes: true
      }, (err, files) => {
        if (err) throw err
        files.forEach(file => {
          if (!file.isDirectory()) {
            ejs.renderFile(path.join(dir, file.name), anwsers, (err, result) => {
              if (err) throw err
              fs.writeFileSync(path.join(des, file.name), result)
            })
          } else {
            fs.mkdir(path.join(des, file.name), () => {
              rd(path.join(dir, file.name), path.join(des, file.name))
            })
          }
        })
      })
    }
    rd(tmplDir, destDir)
  })