export default function getImportPackages(imports) {
  let importText = '';

  for (const packageName in imports) {
    const name = imports[packageName];

    importText += `import ${name} from '${packageName}';\n`;
  }
  return importText;
};
