
import { exec } from 'child_process';

exec('bun index.ts',(err,stdout,stderr)=>{
    if (error) {
        console.error(`Error executing command: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
})