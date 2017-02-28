const ColdSVG = (function () {
    let ids = 0;
    const ns = 'http://www.w3.org/2000/svg';
    class SVGCanvas {
        constructor(x, y) {
            const self = this;
            this.element = document.createElementNS(ns, 'svg');
            this.definitions = document.createElementNS(ns, 'defs');
            this.element.appendChild(this.definitions);
            this.resize(x, y)
        };
        setParent(node) {
            node.appendChild(this.element);
        };
        addChild(child) {
            this.element.appendChild(child.element || child);
            return this;
        };
        resize(x, y) {
            this.element.setAttributeNS(null, 'width', x);
            this.element.setAttributeNS(null, 'height', y);
            return this;
        };
        addDefinition(def, id) {
            this.definitions.appendChild(def.element || def);
            (def.element || def).setAttributeNS(null, 'id', id);
            return this;
        }
        removeDefinition(def) {
            this.definitions.removeChild(def.element || def);
            return this;
        };
    };
    const getSVGCanvas = {
        blank(x, y) {
            return new SVGCanvas(x, y);
        },
        inDocument(x, y) {
            let ctx = new SVGCanvas(x, y);
            document.body.appendChild(ctx.element);
            return ctx;
        },
        inElementNode(element, x, y) {
            let ctx = new SVGCanvas(x, y);
            element.appendChild(ctx.element);
        },
        inElementId(id, x, y) {
            let ctx = new SVGCanvas(x, y);
            let div = document.getElementById(id);
            div.appendChild(ctx);
            return ctx;
        }
    }
    class MatrixBase {
        constructor(shape, attribs) {
            const self = this;
            this.element = document.createElementNS(ns, shape);
            this.element.setAttributeNS(null, 'transform', "matrix(1 0 0 1 0 0 ) translate(0 0) translate(0 0) rotate(0 0 0) skewX(0) skewY(0)  scale(1 1)");
            this._transform = {
                positionX: 0,
                positionY: 0,
                anchorX: 0,
                anchorY: 0,
                pivotX: 0,
                pivotY: 0,
                rotation: 0,
                skewX: 0,
                skewY: 0,
                scaleX: 1,
                scaleY: 1,
                _anchorX: 0,
                _anchorY: 0
            };
            this.transform = new Proxy(this._transform, {
                get: (t, name) => { return self._transform[name] },
                set: (t, name, value) => { transforms[name](self, value) }
            });
            this.attributes = new Proxy({}, {
                get: (target, name) => { return self.element.getAttributeNS(null, name) },
                set: (target, name, value) => { return self.element.setAttributeNS(null, name, value) }
            });
            setAttributes(this.attributes, attribs);
        };
        setParent(svgE) {
            (svgE.element || svgE).appendChild(this.element);
            return this;
        };
        addChild(svgE) {
            this.element.appendChild(svgE.element || svgE);
            return this;
        };
        removeChild(svgE) {
            this.element.removeChild(svgE.element);
            return this;
        };
        setClipPath(svgE) {
            this.element.setAttributeNS(null, 'clip-path', svgE.url);
        };
    };
    class Group extends MatrixBase {
        constructor() {
            super('g');
        };
    };
    class TextPath extends MatrixBase {
        constructor(str, path) {
            super('text');
            this.textPath = document.createElementNS(ns, 'textPath');
            this.element.appendChild(this.textPath);
            this.textPath.setAttributeNS(null, 'href', '#' + path);
            this.textPath.textContent = str;
        };
    };
    class Text extends MatrixBase {
        constructor(str) {
            super('text');
            this.element.textContent = str;
        };
    };
    class Symbol extends MatrixBase {
        constructor(id, first) {
            super('symbol');
            this.element.setAttributeNS(null, 'id', id);
            this.url = `#${symbol.getAttributeNS(null, 'id')}`;
            this.element.appendChild(this.shape);
            if (first) {
                this.element.appendChild(first.element || first);
            };
        };
        addElement(svgB) {
            this.element.appendChild(svgB.element || svgB);
        };
        removeElement(svgB) {
            this.element.removeChild(svgB.element || svgB);
        };
        setParent(svgC) {
            svgC.definitions.appendChild(this.element);
            return this;
        };
        use() {
            let result = document.createElementNS(ns, 'use');
            result.setAttributeNS(null, 'href', this.url);
            return result;
        };
    };
    class Polyline extends MatrixBase {
        constructor(points = "20,100 40,60 70,80 100,20") {
            super('polyline', {
                'points': points,
            });
        };
    };
    class Poligon extends MatrixBase {
        constructor(points = '0,0 10,10 0,10') {
            super('poligon', {
                'points': points
            });
        };
    };
    class Image extends MatrixBase {
        constructor(src) {
            super('image', {
                'href': src
            });
        };
    };
    class Elipse extends MatrixBase {
        constructor(radiusX = 10, radiusY = 5) {
            super('ellipse', {
                'rx': radiusX,
                'ry': radiusY
            });
        };
    };
    class Circle extends MatrixBase {
        constructor(radius = 10) {
            super('circle', {
                'r': radius
            });
        };
    };
    class Path extends MatrixBase {
        constructor(points = 'M 100 100 L 300 100 L 200 300 z') {
            super('path', {
                'd': points
            });
        };
    };
    class Line extends MatrixBase {
        constructor(x1 = 0, y1 = 0, x2 = 10, y2 = 0, w = 1) {
            super('line', {
                'x1': x1,
                'x2': x2,
                'y1': y1,
                'y2': y2,
                'stroke-width': w,
                'stroke': 'black'
            });
        };
    };
    class Rect extends MatrixBase {
        constructor(w, h) {
            super('rect', {
                'width': w,
                'height': h
            });
        };
    };
    class ClipPath extends MatrixBase {
        constructor(id = ids++, mask) {
            super('clipPath', {
                'id': id
            });
            this.url = `url(#${this.element.getAttributeNS(null, 'id')})`;
            if (mask) {
                this.element.appendChild(mask.element);
            };
        };
        addClipElement(svgB) {
            this.element.appendChild(svgB.shape || svgB);
            return this;
        };
        removeClipElement(svgB) {
            this.element.removeChild(svgB.shape || svgB);
            return this;
        };
        setParent(svgC) {
            svgC.definitions.appendChild(this.element);
            return this;
        };
    };
    const setAttributes = function (objA, objB) {
        for (let i in objB) {
            objA[i] = objB[i];
        };
    };
    const transforms = {
        positionX(self, value) {
            self._transform.positionX = value;
            self.element.transform.baseVal.getItem(1).setTranslate(value, self._transform.positionY);
        },
        positionY(self, value) {
            self._transform.positionY = value;
            self.element.transform.baseVal.getItem(1).setTranslate(self._transform.positionX, value);
        },
        anchorX(self, value) {
            self._transform.anchorX = value;
            self._transform._anchorX = -(value * self.element.getBBox().width * self._transform.scaleX);
            self.element.transform.baseVal.getItem(2).setTranslate(self._transform._anchorX, self._transform._anchorY);
        },
        anchorY(self, value) {
            self._transform.anchorY = value;
            self._transform._anchorY = -(value * self.element.getBBox().height * self._transform.scaleY);
            self.element.transform.baseVal.getItem(2).setTranslate(self._transform._anchorX, self._transform._anchorY);
        },
        rotation(self, value) {
            self._transform.rotation = value;
            self.element.transform.baseVal.getItem(3).setRotate(value, self._transform.pivotX, self._transform.pivotY);
        },
        pivotX(self, value) {
            self._transform.pivotX = value;
            self.element.transform.baseVal.getItem(3).setRotate(self._transform.rotation, self._transform.pivotX, value);
        },
        pivotY(self, value) {
            self._transform.pivotY = value;
            self.element.transform.baseVal.getItem(3).setRotate(self._transform.rotation, value, self._transform.pivotY);
        },
        skewX(self, value) {
            self._transform.skewX = value;
            self.element.transform.baseVal.getItem(4).setSkewX(value);
        },
        skewY(self, value) {
            self._transform.skewY = value;
            self.element.transform.baseVal.getItem(5).setSkewY(value);
        },
        scaleX(self, value) {
            self._transform.scaleX = value;
            self.element.transform.baseVal.getItem(6).setScale(value, self._transform.scaleY);
            this.updateAnchor(self);
        },
        scaleY(self, value) {
            self._transform.scaleY = value;
            self.element.transform.baseVal.getItem(6).setScale(self._transform.scaleX, value);
            this.updateAnchor(self);
        },
        updateAnchor(self) {
            self.transform.anchorX = self.transform.anchorX;
            self.transform.anchorY = self.transform.anchorY;
        }
    };
    let giveRect = (w, h, c) => { return new Rect(w, h, c) };
    let giveLine = (x1, y1, x2, y2, w, c) => { return new Line(x1, y1, x2, y2, w, c) };
    let givePath = (p, c) => { return new Path(p, c) };
    let giveCircle = (r, c) => { return new Circle(r, c) };
    let giveClipPath = (id, mask) => { return new ClipPath(id, mask) };
    let giveElipse = (rx, ry, c) => { return new Elipse(rx, ry, c) };
    let giveImage = (src) => { return new Image(src) };
    let givepoligon = (p, c) => { return new Poligon(p, c) };
    let givePolyline = (p, c) => { return new Polyline(p, c) };
    let giveSymbol = (id, svg) => { return new Symbol(id, svg) };
    let giveContainer = (el) => { return new Container(el) };
    let giveText = (str) => { return new Text(str) };
    let giveTextPath = (srt, path) => { return new TextPath(srt, path) };
    return {
        createSVGRenderer: getSVGCanvas,
        rectangle: giveRect,
        line: giveLine,
        path: givePath,
        circle: giveCircle,
        clipPath: giveClipPath,
        elipse: giveElipse,
        image: giveImage,
        poligon: givepoligon,
        polyline: givePolyline,
        symbol: giveSymbol,
        container: giveContainer,
        text: giveText,
        textPath: giveTextPath,
    };
})();