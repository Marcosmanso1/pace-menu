import {spawnSync} from 'node:child_process';
import {readdir,copyFile,unlink,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
await rm(resolve('.build'),{recursive:true,force:true});
for(const args of [['node_modules/typescript/bin/tsc','--noEmit'],['node_modules/vite/bin/vite.js','build']]){
 const r=spawnSync(process.execPath,args,{stdio:'inherit'});if(r.status!==0)process.exit(r.status??1);
}
// Only files with these generated names are replaced. Handwritten source stays untouched.
for(const file of await readdir('.'))if(/^(app|chunk)-[A-Za-z0-9_-]+\.(js|css|webp|svg)$/.test(file))await unlink(file);
for(const file of await readdir('.build'))await copyFile(resolve('.build',file),resolve(file==='development.html'?'index.html':file));
await copyFile(resolve('.build/development.html'),resolve('.build/index.html'));
console.log('Published files are ready in the repository root. Commit source and generated files together.');
