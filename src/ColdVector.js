const ColdVector = (function () {
    let ids = 0;
    const ns = 'http://www.w3.org/2000/svg';
    class SVGCanvas {
        constructor(x, y) {
            const self = this;
            this.element = document.createElementNS(ns, 'svg');
            this.definitions = document.createElementNS(ns, 'defs');
            this.element.appendChild(this.definitions);
            this.resize(x, y);
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
            return ctx;
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
        setClipPath(url) {
            this.element.setAttributeNS(null, 'clip-path', 'url(#' + (typeof url === 'string' ? url : url.element.id) + ')');
            return this;
        };
        changeToDefinition(svgE, id) {
            this.element.id = id || ids++
            svgE.definitions.appendChild(this.element);
            return this;
        };
    };
    class Group extends MatrixBase {
        constructor(svgs, att = {}) {
            super('g', att);
            if (svgs) {
                if (Array.isArray(svgs)) {
                    svgs.map(item => this.element.appendChild(item.element || item));
                } else {
                    this.element.appendChild(svgs);
                };
            };
        };
    };
    class TextPath extends MatrixBase {
        constructor(str, path, att = {}) {
            super('text', att);
            this.textPath = document.createElementNS(ns, 'textPath');
            this.textPath.textContent = str;
            this.element.appendChild(this.textPath);
            if (typeof path === 'string') {
                this.textPath.setAttributeNS(null, 'href', '#' + path);
            } else {
                this.textPath.setAttributeNS(null, 'href', '#' + path.element.id);
            }
        };
    };
    class Text extends MatrixBase {
        constructor(str, att = {}) {
            super('text', att);
            this.element.textContent = str;
        };
    };
    class Use extends MatrixBase {
        constructor(url, att = {}) {
            super('use', att)
            this.element.setAttributeNS(null, 'href', '#' + (typeof url === 'string' ? url : url.element.id));
        }
    }
    class Symbol extends MatrixBase {
        constructor(first, att = {}) {
            super('symbol', att);
            if (first) {
                if (Array.isArray(first)) {
                    first.map(item => this.element.appendChild(item.element || item));
                } else {
                    this.element.appendChild(first.element || first);
                };
            };
        };
        addElement(svgB) {
            this.element.appendChild(svgB.element || svgB);
            return this
        };
        addElements(svgS) {
            svgS.map(item => this.element.appendChild(item.element || item));
            return this;
        };
        removeElement(svgB) {
            this.element.removeChild(svgB.element || svgB);
            return this;
        };
        changeToDefinition(svgC, id) {
            this.element.id = id;
            svgC.definitions.appendChild(this.element);
            return this;
        };
        use() {
            let result = document.createElementNS(ns, 'use');
            return new Use(this.element.id);
        };
    };
    class Polyline extends MatrixBase {
        constructor(points = "20,100 40,60 70,80 100,20", att) {
            super('polyline', Object.assign({
                'points': points,
            }, att));
        };
    };
    class Polygon extends MatrixBase {
        constructor(points = '0,0 10,10 0,10',att={}) {
            super('polygon', Object.assign({
                'points': points
            }, att));
        };
    };
    class Image extends MatrixBase {
        constructor(src, att = {}) {
            super('image', Object.assign({
                'href': src
            }, att));
        };
    };
    class Ellipse extends MatrixBase {
        constructor(radiusX = 10, radiusY = 5, att = {}) {
            super('ellipse', Object.assign({
                'rx': radiusX,
                'ry': radiusY
            }, att));
        };
    };
    class Circle extends MatrixBase {
        constructor(radius = 10, att = {}) {
            super('circle', Object.assign({
                'r': radius
            }, att));
        };
    };
    class Path extends MatrixBase {
        constructor(points = 'M 100 100 L 300 100 L 200 300 z', att = {}) {
            super('path', Object.assign({
                'd': points
            }, att));
        };
    };
    class Line extends MatrixBase {
        constructor(x1 = 0, y1 = 0, x2 = 10, y2 = 0, w = 1, att = {}) {
            super('line', Object.assign({
                'x1': x1,
                'x2': x2,
                'y1': y1,
                'y2': y2,
                'stroke-width': w,
                'stroke': 'black'
            }, att));
        };
    };
    class Rect extends MatrixBase {
        constructor(w, h, att = {}) {
            super('rect', Object.assign({
                'width': w,
                'height': h
            }, att));
        };
    };
    class ClipPath extends MatrixBase {
        constructor(mask, att = {}) {
            super('clipPath', att);
            if (mask) {
                if (Array.isArray(mask)) {
                    mask.map(item => this.element.appendChild(item.element || item));
                } else {
                    this.element.appendChild(mask.element);
                };
            };
        };
        clipElement(svg) {
            if (this.element.id) {
                (svg.element || svg).setAttributeNS(null, 'clip-path', 'url(#' + this.element.id + ')');
                return this;
            } else {
                console.error('The element ' + this + ' has no an id, please use changeToDefinition first');
                return false;
            };
        };
        addClipElement(svgB) {
            this.element.appendChild(svgB.shape || svgB);
            return this;
        };
        addClipElements(svgs) {
            svgs.map(item => this.element.appendChild(item.element || item));
        };
        removeClipElement(svgB) {
            this.element.removeChild(svgB.shape || svgB);
            return this;
        };
        changeToDefinition(svgC, id) {
            this.element.id = id;
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
            self._transform._anchorX = -(value * self.element.getBBox().width * self._transform.scaleX) + self._transform.pivotX;
            self.element.transform.baseVal.getItem(2).setTranslate(self._transform._anchorX, self._transform._anchorY);
        },
        anchorY(self, value) {
            self._transform.anchorY = value;
            self._transform._anchorY = -(value * self.element.getBBox().height * self._transform.scaleY) + self._transform.pivotY;
            self.element.transform.baseVal.getItem(2).setTranslate(self._transform._anchorX, self._transform._anchorY);
        },
        rotation(self, value) {
            self._transform.rotation = value;
            self.element.transform.baseVal.getItem(3).setRotate(value, self._transform.pivotX, self._transform.pivotY);
        },
        pivotX(self, value) {
            self._transform.pivotX = value;
            self.element.transform.baseVal.getItem(3).setRotate(self._transform.rotation, self._transform.pivotX, value);
            this.updateAnchor(self)
        },
        pivotY(self, value) {
            self._transform.pivotY = value;
            self.element.transform.baseVal.getItem(3).setRotate(self._transform.rotation, value, self._transform.pivotY);
            this.updateAnchor(self)
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
    return {
        //Renderer:
        createSVGRenderer: getSVGCanvas,
        //Shapes:
        path: (p, att) => { return new Path(p, att) },
        circle: (r, att) => { return new Circle(r, att) },
        ellipse: (rx, ry, att) => { return new Ellipse(rx, ry, att) },
        rectangle: (w, h, att) => { return new Rect(w, h, att) },
        polygon: (p, att) => { return new Polygon(p, att) },
        //Others:
        image: (src, att) => { return new Image(src, att) },
        symbol: (svg, att) => { return new Symbol(svg, att) },
        clipPath: (id, mask, att) => { return new ClipPath(id, mask, att) },
        group: (el, att) => { return new Group(el, att) },
        //Lines:
        line: (x1, y1, x2, y2, w, att) => { return new Line(x1, y1, x2, y2, w, att) },
        polyline: (p, att) => { return new Polyline(p, att) },
        //Text:
        text: (str, att) => { return new Text(str, att) },
        textPath: (srt, path, att) => { return new TextPath(srt, path, att) },
        //Constructors
        fromSymbol: (id, att) => { return new Use(id, att) },
    };
})();