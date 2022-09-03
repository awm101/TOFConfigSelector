// Node modules used
var fs = require('fs');
var os = require('os');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
const inquirer = require('inquirer');
const path = require('path');

// Getting your Windows PC Username and required directories
const pcName = os.userInfo().username
const markConfig = 'C:\\Users\\' + pcName + '\\AppData\\Local\\Hotta\\Saved\\Config\\WindowsNoEditor\\new-config-mark'
const confDir = 'C:\\Users\\' + pcName + '\\AppData\\Local\\Hotta\\Saved\\Config\\WindowsNoEditor\\'
const customEngineDir = './configs/Engine/'
const customGUSDir = './configs/GameUserSettings/'
const defaultEngine = './defaults/DefaultEngine.ini'
const defaultGUS = './defaults/DefaultGUS.ini'

async function headerTitle() {
    console.info('\n  ===========================================')
    console.info('  Welcome to Tower of Fantasy Config Selector')
    console.info('  -------------------------------------------')
    console.info('  Created by your fellow player, Adamantine')
    console.info('  ===========================================\n')
}
async function closeWindow() {
    setTimeout((function () {
        return process.exit(22);
    }), 3000);
}
async function closeWindowFirst() {
    setTimeout((function () {
        return process.exit(22);
    }), 30000);
}
async function firstRun() {
    fs.readFile(defaultEngine, 'utf-8', async (err, defEngine) => {
        fs.readFile(defaultGUS, 'utf-8', async (err, defGUS) => {
            fs.appendFile(customEngineDir + 'Default.ini', defEngine, async (err) => {
                fs.appendFile(customGUSDir + 'Default.ini', defGUS, async (err) => {
                    console.log('\n  Custom configs directory successfully created!');
                    console.log("\n  Add your custom 'Engine.ini' and 'GameUserSettings.ini'\n  to their respective folders inside 'configs' folder\n  that was just created at where you run this tool.");
                    console.log('\n  Close this window and run it again.');
                    await closeWindowFirst()
                });
            });
        })
    })
}
async function revertConfig() {
    headerTitle()
    console.log("  New configs already applied");
    readline.setPrompt('  Revert to original configs? (y/n): ');
    readline.prompt();
    readline.on('line', async (input) => {
        if (input === 'y') {
            fs.unlink(confDir + 'new-config-mark', (err) => {
                fs.unlink(confDir + 'Engine.ini', (err) => {
                    fs.rename(confDir + 'Engine-ori.ini', confDir + 'Engine.ini', (err) => {
                        readline.close();
                        fs.rename(confDir + 'GameUserSettings-ori.ini', confDir + 'GameUserSettings.ini', async (err) => {
                            console.log(`  Original configs restored!`);
                            await closeWindow()
                        });
                    });
                });
            });
        } else if (input === 'n') {
            console.log(`  No changes applied.`);
            await closeWindow()
        } else {
            console.log('  Choose y or n.')
            readline.prompt();
        }
    })
}
async function applyNewConfig(engineName, gusName, selectedEngine, selectedGUS) {
    headerTitle()
    console.info('  Selected Engine.ini: ', engineName);
    console.info('  Selected GameUserSettings.ini: ', gusName);
    fs.appendFile(confDir + 'new-config-mark', '', async (err) => {
        fs.rename(confDir + 'Engine.ini', confDir + 'Engine-ori.ini', async (err) => {
            fs.appendFile(confDir + 'Engine.ini', selectedEngine, async (err) => {
                fs.rename(confDir + 'GameUserSettings.ini', confDir + 'GameUserSettings-ori.ini', async (err) => {
                    console.log('\n  Original Configs backed up!\n');
                    fs.appendFile(confDir + 'GameUserSettings.ini', selectedGUS, async (err) => {
                        console.log('  Selected Configs Applied!\n');
                        await closeWindow()
                    });
                });
            });
        });
    });
}
async function handleIssue() {
    // headerTitle()
    if (fs.existsSync(markConfig) === true) {
        fs.unlink(confDir + 'new-config-mark', (err) => {});
    }
    if (fs.existsSync(confDir + 'Engine-ori.ini') === true) {
        fs.unlink(confDir + 'Engine-ori.ini', (err) => {});
    }
    if (fs.existsSync(confDir + 'GameUserSettings-ori.ini') === true) {
        fs.unlink(confDir + 'GameUserSettings-ori.ini', (err) => {});
    }
    console.log("  Some files interfering with the execution process have been taken care of.\n\nClose the program and run it again.\n")
    await closeWindow()
}
async function chooseConfigs(engineList, gusList) {
    headerTitle()
    console.info("  Add your custom 'Engine.ini' and 'GameUserSettings.ini'\n  to their respective folders inside 'configs' folder\n  that was just created at where you run this tool.\n");
    const answer = await inquirer
        .prompt([{
                type: 'rawlist',
                name: 'engine',
                message: 'Choose Engine.ini:',
                choices: engineList
            },
            {
                type: 'rawlist',
                name: 'gus',
                message: 'Choose GameUserSettings.ini:',
                choices: gusList
            },
        ])
    console.clear()
    let engineName = answer.engine
    let gusName = answer.gus
    fs.readFile('./configs/Engine/' + answer.engine, 'utf-8', async (err, selectedEngine) => {
        fs.readFile('./configs/GameUserSettings/' + answer.gus, 'utf-8', async (err, selectedGUS) => {
            if (selectedEngine !== null && selectedGUS !== null) {
                await applyNewConfig(engineName, gusName, selectedEngine, selectedGUS)
            }
        })
    })

}
if (fs.existsSync(customEngineDir) !== true && fs.existsSync(customGUSDir) !== true) {
    headerTitle()
    console.info("  This is your first time running this tool.\n")
    console.info("  Creating custom configs directory...")
    fs.mkdir(path.join(__dirname, '/configs/'), async (err) => {
        fs.mkdir(path.join(__dirname + '/configs/', 'Engine'), async (err) => {
            fs.mkdir(path.join(__dirname + '/configs/', 'GameUserSettings'), async (err) => {
                await firstRun()
            });
        });
    });
} else if (fs.existsSync(markConfig) && fs.existsSync(confDir + 'Engine-ori.ini') && fs.existsSync(confDir + 'GameUserSettings-ori.ini')) {
    revertConfig()
} else if (fs.existsSync(markConfig) || fs.existsSync(confDir + 'Engine-ori.ini') || fs.existsSync(confDir + 'GameUserSettings-ori.ini')) {
    handleIssue()
} else {
    let engineList = []
    let gusList = []
    fs.readdir(customEngineDir, async (err, files) => {
        files.forEach(file => {
            engineList.push(file)
        });
        fs.readdir(customGUSDir, async (err, files) => {
            files.forEach(file => {
                gusList.push(file)
            });
            await chooseConfigs(engineList, gusList)
        });
    });
}