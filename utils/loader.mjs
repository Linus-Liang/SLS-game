// TODO actually write a good parser
function parseList(text) {
    const list = Object.fromEntries(
        text.split('\n') // make an array of strings representing every line
            .map(line => {
                // ignore this line, if comment character is at the beginning
                if (line.search('#') === 0) return [];

                if (line.search('relativeTo') === 0) return line.split(':').map(str => str.trim());

                // splits the `name` and the `resources` components of the bundle
                const [name, resources] = line.split(':');
                return [
                    name.trim(), // removes whitespace around the `name` component
                    // splits the resources into 
                    Object.fromEntries(resources.split(',').map(str => str.trim().split('=')))
                ]
            })
    );
    return list;
}

async function loadShaders(shadersList) {
    // fetch the list and convert it to text (aka a string), and parse it
    const downloadList = parseList(await (await fetch(shadersList)).text());
    for (const bundle of Object.values(downloadList)) {
        // if it's not an Object, then it's probably a config
        if (typeof bundle != 'object') continue;

        for (const [resourceName, resourcePath] of Object.entries(bundle)) {
            // const resource = await (await fetch(downloadList.relativeTo + resourcePath)).text();
            // bundle[resourceName] = resource;
            Object.defineProperty(bundle, resourceName, {
                value: fetch(downloadList.relativeTo + resourcePath).then(res => res.text())
            });
        }
    }
    return downloadList;
}

async function loadWASM(wasmList) {
    const downloadList = parseList(await (await fetch(wasmList)).text());
    for (const bundle of Object.values(downloadList)) {
        for (const [resourceName, resourcePath] of Object.entries(bundle)) {
            bundle[resourceName] = await WebAssembly.compileStreaming(fetch(dowloadList.relativeTo + resourcePath));
        }
    }
    return downloadList;
}

export async function load(shadersList) {
    return loadShaders(shadersList);
}
