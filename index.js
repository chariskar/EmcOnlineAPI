
import { exec } from 'child_process';

exec('bun index.ts',(err,stdout,stderr)=>{
    
    console.log(`stdout: ${stdout}`);
})