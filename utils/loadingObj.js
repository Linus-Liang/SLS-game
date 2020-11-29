async function loadOBJ(path) {
    const objData = await (await fetch(path)).text();


}

class ObjPoint {
    constructor() {
        this.vertices = [];
        this.colors   = [];
        this.material = null;
    }
}

class ObjLine {
    constructor() {
        this.vertices = [],
        this.colors   = [],
        this.textures = [],
        this.material = null
    }
}  

class ObjTriangles {
    constructor() {
        this.vertices       = [];
        this.colors         = [];
        this.flat_normals   = [];
        this.smooth_normals = [];
        this.textures       = [];
        this.material       = null;
    }
}  

class ModelArrays {
    constructor(name) {
        this.name      = name;
        this.points    = null;
        this.lines     = null;
        this.triangles = null;
    }
}

class ModelArrays {
    constructor(material_name) {
        this.name       = material_name;
        this.index      = -1;
        this.Ns         = null;
        this.Ka         = null;
        this.Kd         = null;
        this.Ks         = null;
        this.Ni         = null;
        this.d          = null;
        this.illum      = null;
        this.map_kd     = null;
        this.textureMap = null;
    }
}


// Extracting Data values

class StringParser {
    constructor(str) {
        this.str   = str;
        this.index = 0;
    }

    restart() {
        this.index = 0;
    }

    isDelimiter(c) {
        return [' ', '\t', '(', ')'].includes(c);
    }

    skipDelimiters() {
        while (
            index < str.length &&
            this.isDelimiter(str.charAt(index))
        ) {
            index += 1;
        }
    };

    getWordLength() {
        var i = start;
        while (i < this.str.length && !this.isDelimiter(this.str.charAt(i))) {
            i +=1;
        }
        return i - start;
    };

    skipToNextWord() {
        skipDelimiters();
        index += (this.getWordLength(index) + 1);
    };

    getWord() {
        var w, word;
        this.skipDelimiters();
        w = this.getWordLength(index);
        if (w === 0) {
            return null;
        }
        word = this.str.substr(index, w);
        index += (w + 1);

        return word;
    };
    
    getInt() {
        var word = getWord();
        if (word) {
            return parseInt(word, 10);
        }
        return null;
    };

    getFloat() {
        var word = getWord();
        if (word) {
            return parseFloat(word);
        }
        return null;
    };

    getIndexes(indexes) {
        var j, word, indexesAsStrings;
        word = self.getWord();
        if (word) {
            indexes[0] = -1;
            indexes[1] = -1;
            indexes[2] = -1;

            indexesAsStrings = word.split("/");
            for (j = 0; j < indexesAsStrings.length; j += 1) {
                indexes[j] = parseInt (indexesAsStrings[j], 10);
                if (isNaN(indexes[j])) {
                    indexes[j] = -1;
                }
            }
            return true;
        }
        return false;
    };

    RestOfLine() {
        return this.str.substr(index);
    }
};

// Converting OBJ into data into 1D arrays

// @param model_description String Contains the model data.
// @param materialsDictionary Dictionary of material objects.
// @param out An object that knows where to display output messages
// @return Object A set of ModelArray objects accessible by name or index.
function createModelsWithObj(modelDescription, materialsDictionary, out) {

    //return value is an object
    //property name comes forom the model's name.

    var modelDictionary = {};
    var numberModels = 0;

    //All array indexes are empty because OBJ indexes start at 1
    //Arrays of values are usually common throughout all files

    var allVertices = [[]];
    var allColors = null;
    var allNormals = [[]];
    var avrNormals = null;
    var allTextureCoords = [[]];
    
    //instance
    //Model being defined, Objs can define more then one model
    var currentModel = null;

    //If state is active
    var smoothShading = false;
    var materialName = null;
    var colorIndex = 0;

    //Collecting data for scratch var
    var startLineIndexes = new Array(3);
    var endLineIndexes = new Array(3);
    var vector = new loadingObj_vector3();
    var vertexIndexes = new Array(3);

    //Lines segments --- allowing normal vectors to be created
    var create_visible_normals = false;

    function colorsFromMaterials() {
        var material, name, number_colors, index;
        if (Object.keys(materialsDictionary).length > 0) {
            number_colors = Object.keys(materialsDictionary).length;
            all_colors = new Array(number_colors);
            for (name in materialsDictionary) {
                material = materialsDictionary[name];
                if (material.hasOwnProperty('Kd')) {
                    index = material.index;
                    all_colors[index] = material.Kd;
                }
            }

        }
    }

    function parsingPoints(sp) {
        var index;

        if (currentModel.points === null) {
            currentModel.points = new PointsData();
            currentModel.points.material = materialsDictionary[materialName];
        }

        //Aquires the indexes of the vertices that define the point(s)
        index = sp.getWord();
        while (index) {
            //Add a point to model def
            currentModel.points.vertices.push(index);
            currentModel.points.colors.push(colorIndex);
            
            index = sp.getWord();
        }
    }
    
    function parsingLines(sp) {
        if (currentModel.lines === null) {
            currentModel.lines = new LinesData();
            currentModel.lines.material = materialsDictionary[materialName];
        }

        // Get indexes of vertices that define point/points
        sp.getIndexes(startLineIndexes);
        while (sp.getIndexes(endLineIndexes)) {
            // Adds a line to the model def
            currentModel.lines.vertices.push(startLineIndexes[0]);
            currentModel.lines.vertices.push(endLineIndexes[0]);
            currentModel.lines.colors.push(colorIndex);
            currentModel.lines.colors.push(colorIndex);
            if (startLineIndexes[1] !== null && startLineIndexes[1] >= 0) {
                currentModel.lines.texture.push(startLineIndexes[1]);
                currentModel.lines.texture.push(endLineIndexes);
            }

            startLineIndexes[0] = endLineIndexes[0];
            startLineIndexes[1] = endLineIndexes[1];
        }
    }

    function parsingFaces(sp) {
        var indexList, numberTriangles, triangles, n, edge1, edge2, normal, normalIndex;

        if(currentModel.triangles === null) {
            currentModel.triangles = new TrianglesData();
            currentModel.triangles.material = materialsDictionary[materialName];
        }

        triangles = currentModel.triangles;

        //indexes of vertices that define the face
        indexList = [];
        while (sp.getIndexes(vertexIndexes)) {
            indexList.push(vertexIndexes.slice());
        }

        //Creates triangles for faces
        numberTriangles = indexList.length - 2;
        n = 1;
        while (n <= numberTriangles) {
            triangles.vertices.push(indexList[0][0]);
            triangles.vertices.push(indexList[n][0]);
            triangles.vertices.push(indexList[n + 1]);

            triangles.colors.push(colorIndex);
            triangels.color.push(colorIndex);
            triangles.colors.push(colorIndex);

            if (indexList[0][1] > -1) {
                triangles.textures.push(indexList[0][1]);
                triangles.textures.push(indexList[n][1]);
                triangles.textures.push(indexList[n + 1][1]);
            }


            // The normal vectors are set:
        // If normal vectors are included in the OBJ file: use the file data
        // If normal vectors not in OBJ data:
        //   the flat_normal is set to the calculated face normal.
        //   the smooth_normals is set to an average normal if smoothing is on.

            if(indexList[0][2] === -1) {

            // There was no normal vector in the OBJ file; calculate a normal vector
            // using a counter-clockwise vertex winding.
            // Only calculate one normal for faces with more than 3 vertices
            
            if (n === 1) {
                edge1 = vector.createFrom2Points(allVertices[indexList[0][0]], allVertices[indexList[n][0]]);
                edge2 = vector.createFrom2Points(allVertices[indexList[n][0]], allVertices[indexList[n + 1][0]]);
                normal = new Float32Array(3);
                vector.crossProduct(normal, edge1, edge2);
                vector.normalize(normal);

                allNormals.push(normal);
                normalIndex = allNormals.length -1;
            }

            triangles.flat_normal.push(normalIndex);
            triangles.flat_normal.push(normalIndex);
            triangles.flat_normal.push(normalIndex);

            if (smoothShading) {
                //indexes point to vertex so average normal vector can be accessed at another point
                triangles.smooth.normals.push(-indexList[0][0]);
                triangles.smooth.normals.push(-indexList[n][0]);
                triangles.smooth.normals.push(-indexList[n + 1][0]);
            } else {
                triangles.smooth.normals.push(normalIndex);
                triangles.smooth.normals.push(normalIndex);
                triangles.smooth.normals.push(normalIndex);
            }

            } else {
                // Use normal vector from the obj file
                triangles.flat_normal.push(indexList[0][2]);
                triangles.flat_normal.push(indexList[n][2]);
                triangles.flat_normal.push(indexList[n + 1][2]);

                triangles.smooth_normal.push(indexList[0][2]);
                triangles.smooth_normal.push(indexList[n][2]);
                triangles.smooth_normal.push(indexList[n + 1][2]);
            }
            n += 1 //for more then one triangle
        }
    }

    function ParsingObjLines() {
        var sp, lines, whichLine, command, modelName, currentModelFile, vertices, x, y, z, dotPosition, dx, dy, dz, u, v, coords, normal;

        //Creating StringParser
        sp = new StringParser();

        //breaks up the input into different lines of text
        lines = modelDescription.split('\n');

        //vertices are broken into sections, this is for each model, face indexes for vertices are global for the vertex list. TODO Keep a single list of vertices for all models.
        vertices = [];

        //OBJ vertices are indexed starting at the number one, remember that it is not 0
        verticess.push([]); //empty vertex for [0]

        for (whichLine = 0; whichLine < lines.length; whichLine += 1) {
            sp.init(lines[whichLine]);
            command = sp.getWord();

            if (command) {
                switch (command) {
                    case '#':
                        break; 

                    case 'mtllib': //save material data filename for later
                        currentMaterialFiles = sp.getWord();
                        //Removing the filename extention
                        dotPosition = currentMaterialFiles.lastIndexOf('.');
                        if (dotPosition > 0) {
                            currentMaterialFiles = currentMaterialFiles.substr(0, dotPosition);
                        }
                        break;
                }
            }
        }
    }
}