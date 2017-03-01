//The <svg> element 
let svg = ColdVector.createSVGRenderer.inDocument(2000, 2000)






/*Shapes*/
//Path
let path1 = ColdVector.path("M230 230 A 45 45, 0, 1, 1, 275 275 L 275 230 Z", {'fill': 'red', 'stroke-width': '4','stroke':'black' }).setParent(svg)

//Circle
let circle = ColdVector.circle(30,{'fill':'#c1c1c1'}).setParent(svg)
circle.transform.positionX = 30
circle.transform.positionY = 100

//Ellipse
let ellipse = ColdVector.ellipse(20, 50,{'stroke-width':5,'stroke':'green'}).setParent(svg)
ellipse.transform.positionX = 200
ellipse.transform.positionY = 100

//Rectangle
let rectangle = ColdVector.rectangle(80, 60,{'fill':'#9eD9f7'}).setParent(svg)
rectangle.transform.positionX = 400
rectangle.transform.positionY = 100

//polygon
let polygon = ColdVector.polygon("60,20 100,40 100,80 60,100 20,80 20,40",{'stroke':'#00ffaa','stroke-width':1}).setParent(svg)










/*Others*/    
//Image                    
let image = ColdVector.image("https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png").setParent(svg)
image.transform.positionX = 500
image.transform.positionY = 100
image.transform.rotation = 45
image.transform.scaleX = 0.2
image.transform.scaleY = 0.2


//Symbool
let shape1 = ColdVector.ellipse(30,95,{'fill':'#393a73'})
let shape2 = ColdVector.rectangle(20,80,{'fill':'#b0dff9'})
shape1.transform.positionX = 30
shape1.transform.positionY = 95
shape2.transform.positionX = 20
shape2.transform.positionY = 80

let symbol = ColdVector.symbol([shape1,shape2]).changeToDefinition(svg,'sy1') 

let copy1 = symbol.use().setParent(svg)
let copy2 = ColdVector.fromSymbol(symbol).setParent(svg)
let copy3 = ColdVector.fromSymbol('sy1').setParent(svg)
copy1.transform.positionX = 100
copy1.transform.positionY = 500
copy2.transform.positionX = 200
copy2.transform.positionY = 500
copy3.transform.positionX = 300
copy3.transform.positionY = 500

//Clip path
let shape3 = ColdVector.rectangle(300,30)
let shape4 = ColdVector.rectangle(30,300)
shape4.transform.positionX = 10
shape4.transform.positionY = 10

let image2 = ColdVector.image("https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png").setParent(svg)
let image3 = ColdVector.image("https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png").setParent(svg)
image2.transform.scaleX = 0.5
image2.transform.scaleY = 0.5
image3.transform.scaleX = 0.5
image3.transform.scaleY = 0.5
image3.transform.positionX = 300
image3.transform.positionY = 0.5

let clipPath = ColdVector.clipPath([shape3,shape4]).changeToDefinition(svg,'cp1')

image2.setClipPath(clipPath)
clipPath.clipElement(image3)

//Group
let group = ColdVector.group().setParent(svg)
let shape6 = ColdVector.rectangle(80,80,{'fill':'orange'}).setParent(group)
let shape7  = ColdVector.circle(50,{'fill':'gray'})
group.addChild(shape7)
group.transform.positionX = 300
group.transform.positionY = 0.5








/*Lines*/
//Line
let line = ColdVector.line(0,0,300,300,5,{'fill':'red'}).setParent(svg)

//Polyline
let polyline = ColdVector.polyline("0,40 40,40 40,80 80,80 80,120 120,120 120,160",{'stroke':'red','stroke-width':2}).setParent(svg)









/*Text*/
//Normal text
let text = ColdVector.text('SVG TEXT').setParent(svg)
text.transform.positionX = 300
text.transform.positionY = 300

//Text Path
let txtPath = ColdVector.path("M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80").changeToDefinition(svg,'txtPath') 
let textPath = ColdVector.textPath('ABCDEFGHIJKLMNOPQRSTUVWXYZ',txtPath,{'font-family':"Verdana", 'font-size':"18.5"}).setParent(svg)