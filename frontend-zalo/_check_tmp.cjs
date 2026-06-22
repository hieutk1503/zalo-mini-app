const fs = require('fs');
const ts = require('typescript');
const files = [
  ['src/service/request.ts', ts.ScriptKind.TS],
  ['src/pages/Home/HomePage.tsx', ts.ScriptKind.TSX],
];
let bad = 0;
for (const [f, kind] of files) {
  const src = fs.readFileSync(f, 'utf8');
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, kind);
  const diags = sf.parseDiagnostics || [];
  console.log(`### ${f} — ${diags.length} syntax diagnostic(s)`);
  for (const d of diags) {
    const p = d.start != null ? sf.getLineAndCharacterOfPosition(d.start) : {line:-1,character:-1};
    console.log(`  L${p.line+1}:${p.character+1} TS${d.code} ${ts.flattenDiagnosticMessageText(d.messageText,'\n')}`);
    bad++;
  }
}
console.log(`TOTAL syntax errors: ${bad}`);
