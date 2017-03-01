//The <svg> element 
let svg = ColdVector.createSVGRenderer.inDocument(2000, 2000)




/*Shapes*/
//Path
let path1 = svg.path("M230 230 A 45 45, 0, 1, 1, 275 275 L 275 230 Z", {'fill': 'red', 'stroke-width': '4','stroke':'black' })

//Circle
let circle = svg.circle(30,{'fill':'#c1c1c1'}).position.set(30,100)

//Ellipse
let ellipse = svg.ellipse(20, 50,{'stroke-width':5,'stroke':'green'})
    .position.set(200,100)

//Rectangle
let rectangle = svg.rectangle(80, 60,{'fill':'#9eD9f7'})
    .position.set(400,100)


//polygon
let polygon = svg.polygon("60,20 100,40 100,80 60,100 20,80 20,40",{'stroke':'#00ffaa','stroke-width':1})





/*Others*/    
//Image                    
let image = svg.image("https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png")
    .position.set(500,100)
    .scale.set(0.2,0.2)
    .rotation = 45


//Symbool
let shape1 = ColdVector.shapes.ellipse(30,95,{'fill':'#393a73'})
    .position.set(30,95)

let shape2 = ColdVector.shapes.rectangle(20,80,{'fill':'#b0dff9'})
    .position.set(20,80)

let symbol = svg.symbol([shape1,shape2])

let copy1 = symbol.use()
    .position.set(100,500)

let copy2 = svg.fromSymbol(symbol)
    .position.set(200,500)


//Clip path
let shape3 = ColdVector.shapes.rectangle(300,30)
let shape4 = ColdVector.shapes.rectangle(30,300)
    .position.set(10,10)


let image2 = svg.image("https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png")
    .scale.set(0.5,0.5)

let image3 = svg.image("https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png")
    .scale.set(0.5,0.5)
    .position.set(300,0.5)


let clipPath = svg.clipPath([shape3,shape4])
    .clipElement(image3)
    .clipElement(image2)

//Group
let group = svg.group()
    .position.set(300,0.5)

let shape6 = svg.rectangle(80,80,{'fill':'orange'})
    .setParent(group)

let shape7  = ColdVector.shapes.circle(50,{'fill':'gray'})
    .setParent(group)


/*Lines*/
//Line
let line = svg.line(0,0,300,300,5,{'fill':'red'})

//Polyline
let polyline = svg.polyline("0,40 40,40 40,80 80,80 80,120 120,120 120,160",{'stroke':'red','stroke-width':2})





/*Text*/
//Normal text
let text = svg.text('SVG TEXT')
    .position.set(300,300)


//Text Path
let txtPath = svg.path("M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80")
    .isDefinition(true)

let textPath = svg.textPath('ABCDEFGHIJKLMNOPQRSTUVWXYZ',txtPath,{'font-family':"Verdana", 'font-size':"18.5"})