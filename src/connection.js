class Connection extends BPMNElement {

    static get ARROW_SEGMENT_LENGTH() {
        return 20;
    }

    get segments() {
        return this._segments;
    }

    constructor(settings) {
        super(settings);
        this._segments = [];
        this._origShape = null;
        this._destShape = null;

        settings = jQuery.extend({
            origShape: null,
            destShape: null
        }, settings);

        this.setOrigShape(settings.origShape)
            .setDestShape(settings.destShape);
    }

    _isValid(origShape, destShape) {
        return origShape !== destShape;
    }

    _onShapeDragStart() {
        this._html.setAttribute("opacity", 0.5);
    }

    _onShapeDragEnd() {
        this._html.setAttribute("opacity", 1);
    }

    _addDragListeners(shape) {
        this._canvas.addEventListener(BPMNShape.EVENT.DRAG_START, shape, this._onShapeDragStart, this);
        this._canvas.addEventListener(BPMNShape.EVENT.DRAG_END, shape, this._onShapeDragEnd, this);

        return this;
    }

    _removeDragListeners(shape) {
        this._canvas.removeEventListener(BPMNShape.EVENT.DRAG_START, shape, this._onShapeDragStart, this);
        this._canvas.removeEventListener(BPMNShape.EVENT.DRAG_END, shape, this._onShapeDragEnd, this);

        return this;
    }

    setOrigShape(shape) {
        if (!(shape instanceof BPMNShape)) {
            throw new Error('setOrigShape(): invalid parameter.');
        } else if (!this._isValid(shape, this._destShape)) {
            throw new Error('setOrigShape(): The origin and destiny are the same.');
        }

        if (shape !== this._origShape) {
            if (this._origShape) {
                let oldOrigShape = this._origShape;

                this._origShape = null;
                oldOrigShape.removeConnection(this);
                this._removeDragListeners(oldOrigShape);
            }

            this._origShape = shape;
            shape.addOutgoingConnection(this);
            this._addDragListeners(shape);

            if (this._html) {
                this.connect();
            }
        }

        return this;
    }

    getOrigShape() {
        return this._origShape;
    }

    setDestShape(shape) {
        if (!(shape instanceof BPMNShape)) {
            throw new Error('setOrigShape(): invalid parameter.');
        } else if (!this._isValid(this._origShape, shape)) {
            throw new Error('setDestShape(): The origin and destiny are the same.');
        }

        if (shape !== this._destShape) {
            if (this._destShape) {
                let oldDestShape = this._destShape;

                this._destShape = null;
                oldDestShape.removeConnection(this);
                this._removeDragListeners(oldDestShape);
            }

            this._destShape = shape;
            shape.addIncomingConnection(this);
            this._addDragListeners(shape);

            if (this._html) {
                this.connect();
            }
        }

        return this;
    }

    getDestShape() {
        return this._destShape;
    }

    getBBoxExtremePoints() {
        if (this._html) {
            let bbox = this._dom.path.getBBox();

            return {
                min: {
                    x: bbox.x,
                    y: bbox.y
                },
                max: {
                    x: bbox.x + bbox.width,
                    y: bbox.y + bbox.height
                }
            };
        }
        return {
            min: { x: 0, y: 0 },
            max: { x: 0, y: 0 }
        };
    }

    disconnect() {
        return this.removeFromCanvas();
    }

    isConnectedWith(shape) {
        return this._origShape === shape || this._destShape === shape;
    }

    connect() {
        if (this._html && this._origShape && this._destShape && this._origShape !== this.destShape) {
            let waypoints,
                ports = ConnectionManager.getConnectionPorts(this._origShape, this._destShape);

            this._segments = [];

            if (ports.orig) {
                let segments = "";

                this._origShape.assignConnectionToPort(this, ports.orig.portIndex);
                this._destShape.assignConnectionToPort(this, ports.dest.portIndex);

                waypoints = ConnectionManager.getWaypoints(ports.orig, ports.dest);

                segments += `M${ports.orig.point.x} ${ports.orig.point.y} `;

                waypoints.push({
                    x: ports.dest.point.x,
                    y: ports.dest.point.y
                });

                for (let i = 0; i < waypoints.length; i += 1) {
                    segments += `L${waypoints[i].x} ${waypoints[i].y} `;

                    if (i) {
                        this._segments.push([
                            {
                                x: waypoints[i - 1].x,
                                y: waypoints[i - 1].y
                            },
                            {
                                x: waypoints[i].x,
                                y: waypoints[i].y
                            }
                        ]);
                    }
                }

                this._segments.unshift([
                    {
                        x: ports.orig.point.x,
                        y: ports.orig.point.y
                    },
                    {
                        x: waypoints[0].x,
                        y: waypoints[0].y
                    }
                ]);

                waypoints.unshift({
                    x: ports.orig.point.x,
                    y: ports.orig.point.y
                });

                this._dom.arrow.setAttribute("transform", `translate(${waypoints[waypoints.length - 1].x}, ${waypoints[waypoints.length - 1].y})`);
                this._dom.arrowRotateContainer.setAttribute("transform", `scale(0.5, 0.5) rotate(${90 * ports.dest.portIndex})`);
                this._dom.arrow.style.display = '';
                this._dom.path.setAttribute("d", segments);
                this._html.appendChild(this._dom.arrow);
            } else {
                this._dom.path.setAttribute("d", "");
                this._dom.arrow.style.display = 'none';
            }
        }

        return this;
    }

    removeFromCanvas() {
        let oldCanvas = this._canvas,
            origShape = this._origShape,
            destShape = this._destShape;

        if (oldCanvas) {
            if (origShape.getOutgoingConnections().has(this)) {
                this._origShape = null;
                origShape.removeConnection(this);
                this._removeDragListeners(origShape);
            }

            if (destShape.getIncomingConnections().has(this)) {
                this._destShape = null;
                destShape.removeConnection(this);
                this._removeDragListeners(destShape);
            }

            super.removeFromCanvas();
        }

        return this;
    }

    _createHTML() {
        let arrowWrapper,
            arrowWrapper2,
            arrow,
            path;

        if (this._html) {
            return this;
        }

        super._createHTML();
        this._html.setAttribute("class", "connection");

        arrowWrapper = SVGFactory.create('g');
        arrowWrapper2 = SVGFactory.create('g');
        arrowWrapper2.setAttribute("transform", "scale(0.5,0.5) rotate(-180)");
        arrow = SVGFactory.create('path');
        arrow.setAttribute("end", "target");
        arrow.setAttribute("d", "M 0 0 L -13 -26 L 13 -26 z");

        path = SVGFactory.create('path');
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "black");

        arrowWrapper2.appendChild(arrow);
        arrowWrapper.appendChild(arrowWrapper2);
        this._html.appendChild(path);
        this._dom.path = path;
        this._dom.arrow = arrowWrapper;
        this._dom.arrowRotateContainer = arrowWrapper2;

        return this.connect();
    }
}
