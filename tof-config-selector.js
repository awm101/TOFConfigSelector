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
    console.info('\n  ================ Welcome to ================')
    console.info('  +++++----------------------------------+++++')
    console.info('  +---- TOWER OF FANTASY CONFIG SELECTOR ----+')
    console.info('  +++++----------------------------------+++++')
    console.info('  ============================================')
    console.info('  === created by your fellow player, =========')
    console.info('  === Adamantine (Mistilteinn) ===============')
    console.info('  ============================================\n')
    
}
async function closeWindow() {
    setTimeout((function () {
        return process.exit(22);
    }), 3000);
}
// async function closeWindowFirst() {
//     setTimeout((function () {
//         return process.exit(22);
//     }), 30000);
// }
async function firstRun() {
    fs.readFile(defaultEngine, 'utf-8', async (err, defEngine) => {
        fs.readFile(defaultGUS, 'utf-8', async (err, defGUS) => {
            fs.appendFile(customEngineDir + 'Default.ini', defEngine, async (err) => {
                fs.appendFile(customGUSDir + 'Default.ini', defGUS, async (err) => {
                    // console.log('\n  Custom configs directory successfully created!');
                    // console.log("\n  Add your custom 'Engine.ini' and 'GameUserSettings.ini'\n  to their respective folders inside 'configs' folder\n  that was just created at where you run this tool.");
                    // console.log('\n  Close this window and run it again.');
                    setTimeout((function () {
                        console.clear()
                        // getConfigList()
                        mainMenu()
                    }), 5000);
                });
            });
        })
    })
}
async function mainMenu() {
    headerTitle()
    const answer = await inquirer
        .prompt([{
            type: 'rawlist',
            name: 'menu',
            message: 'What do you want to do?',
            choices: ['Select custom configs', 'Restore backup']
        }, ])
    // console.log(answer.menu)
    console.clear()
    if (answer.menu === 'Select custom configs') {
        await getConfigList()
    } else if (answer.menu === 'Restore backup') {
        await revertConfig()
    }
}
async function revertConfig() {
    headerTitle()
    // console.log("  New configs already applied");
    if (fs.existsSync(markConfig) && fs.existsSync(confDir + 'Engine-ori.ini') && fs.existsSync(confDir + 'GameUserSettings-ori.ini')) {
        const answer = await inquirer
            .prompt([{
                type: 'rawlist',
                name: 'input',
                message: 'Revert to original configs?',
                choices: ['Yes', 'No']
            }, ])
        if (answer.input === 'Yes') {
            fs.unlink(confDir + 'new-config-mark', (err) => {
                fs.unlink(confDir + 'Engine.ini', (err) => {
                    fs.rename(confDir + 'Engine-ori.ini', confDir + 'Engine.ini', (err) => {
                        readline.close();
                        fs.rename(confDir + 'GameUserSettings-ori.ini', confDir + 'GameUserSettings.ini', async (err) => {
                            console.log(`\n  Original configs restored!`);
                            setTimeout((function () {
                                console.clear()
                                mainMenu()
                            }), 2500);
                        });
                    });
                });
            });
        } else if (answer.input === 'No') {
            console.log(`\n  No changes applied.`);
            setTimeout((function () {
                console.clear()
                mainMenu()
            }), 2500);
        }
    } else if (fs.existsSync(markConfig) || fs.existsSync(confDir + 'Engine-ori.ini') || fs.existsSync(confDir + 'GameUserSettings-ori.ini')) {
        console.info("  No backup found or perhaps... you're messing with the backup structure I have created.\n")
        console.info("  But don't worry, I will handle this issue regardless. Wait a bit...\n")
        setTimeout((function () {
            console.clear()
            handleIssue()
        }), 4000);
    } else {
        console.info('  No backup found\n')
        console.info('  Redirecting to Main Menu...')
        setTimeout((function () {
            console.clear()
            mainMenu()
        }), 3000);
    }
}
async function applyNewConfig(engineName, gusName, selectedEngine, selectedGUS) {
    headerTitle()
    if (fs.existsSync(markConfig) && fs.existsSync(confDir + 'Engine-ori.ini') && fs.existsSync(confDir + 'GameUserSettings-ori.ini')) {
        console.info('  Selected Engine.ini: ', engineName);
        console.info('  Selected GameUserSettings.ini: ', gusName);
        // fs.appendFile(confDir + 'new-config-mark', '', async (err) => {
            // fs.rename(confDir + 'Engine.ini', confDir + 'Engine-ori.ini', async (err) => {
                fs.appendFile(confDir + 'Engine.ini', selectedEngine, async (err) => {
                    // fs.rename(confDir + 'GameUserSettings.ini', confDir + 'GameUserSettings-ori.ini', async (err) => {
                        // console.log('\n  Original Configs backed up!\n');
                        fs.appendFile(confDir + 'GameUserSettings.ini', selectedGUS, async (err) => {
                            console.info('  New Selected Configs Applied!\n');
                            setTimeout((function () {
                                console.clear()
                                mainMenu()
                            }), 3000);
                        });
                    // });
                });
            // });
        // });
    } else {
        console.info('  Selected Engine.ini: ', engineName);
        console.info('  Selected GameUserSettings.ini: ', gusName);
        fs.appendFile(confDir + 'new-config-mark', '', async (err) => {
            fs.rename(confDir + 'Engine.ini', confDir + 'Engine-ori.ini', async (err) => {
                fs.appendFile(confDir + 'Engine.ini', selectedEngine, async (err) => {
                    fs.rename(confDir + 'GameUserSettings.ini', confDir + 'GameUserSettings-ori.ini', async (err) => {
                        console.log('\n  Original Configs backed up!\n');
                        fs.appendFile(confDir + 'GameUserSettings.ini', selectedGUS, async (err) => {
                            console.log('  Selected Configs Applied!\n');
                            setTimeout((function () {
                                console.clear()
                                mainMenu()
                            }), 3000);
                        });
                    });
                });
            });
        });
    }
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
    console.log("  Some issue interfering with the execution process have been taken care of.\n\nClose the tool and run it again.\n")
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
async function getConfigList() {
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
    // } else if (fs.existsSync(markConfig) && fs.existsSync(confDir + 'Engine-ori.ini') && fs.existsSync(confDir + 'GameUserSettings-ori.ini')) {
    //     revertConfig()
    // } else if (fs.existsSync(markConfig) || fs.existsSync(confDir + 'Engine-ori.ini') || fs.existsSync(confDir + 'GameUserSettings-ori.ini')) {
    //     handleIssue()
} else {
    mainMenu()
}