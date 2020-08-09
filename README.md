# drawJS
An extendable javascript library for drawing SVG diagrams.

![drawJS in action](assets/drawjs.gif)

This is a premiliminary version (v0.1.0), I'll be updating it. Documentation will be added in future upates.

## Installation
    npm install drawjs

## Usage
```html
<html>
    <head>
        <link rel="stylesheet" href="css/drawJS.dev.css"/>
        <style>
          .canvas tspan {
            fill: #7a7a7a;
          }

          .shape .main-element {
            fill: #F5FDFF;
            stroke: #ABD0D8;
            stroke-width: 3;
          }

          .connection .path {
            stroke: #888888;
          }

          .connection .arrow {
            fill: #888888;
          }
        </style>
        <script src="js/draw.dev.js"></script>
        <script type="text/javascript">
            const rectA = new DrawJS.Rectangle({
                id: 'rectA',
                text: "Rect A",
                x: 113,
                y: 475
            });
            const rectB = new DrawJS.Rectangle({
                id: 'rectB',
                text: "Rect B",
                x: 285,
                y: 114
            });
            const rectC = new DrawJS.Rectangle({
                id: 'rectC',
                text: "Rect C",
                x: 584,
                y: 447
            });
            const rectD = new DrawJS.Rectangle({
                id: 'rectD',
                text: "Rect D",
                x: 252,
                y: 413
            });
            const circleA = new DrawJS.Circle({
              id: 'circleA',
              text: 'Circle A',
              x: 190,
              y: 189,
            });
            const triangleA = new DrawJS.Triangle({
              id: 'triangleA',
              text: 'Triangle A',
              x: 112,
              y: 315,
            });
            const ellipseA = new DrawJS.Ellipse({
              id: 'ellipseA',
              text: 'Ellipse A',
              radiusX: 110,
              radiusY: 40,
              x: 420,
              y: 216,
            });
            const canvas = new DrawJS.Canvas({
              width: 1440,
              height: 900,
              shapes: [
                rectA,
                rectB,
                rectC,
                rectD,
                circleA,
                triangleA,
                ellipseA,
              ],
              connections: [
                {
                  orig: circleA,
                  dest: rectA,
                },
                {
                  orig: 'rectA',
                  dest: 'triangleA'
                },
                {
                  orig: 'triangleA',
                  dest: rectB,
                }
              ],
              onChange: (...args) => {
                undoButton.disabled = false;
                redoButton.disabled = true;
              }
            });

            let undoButton;
            let redoButton;
            const undo = () => {
              undoButton.disabled = canvas.undo() === 0;
              redoButton.disabled = false;
            };

            const redo = () => {
              redoButton.disabled = canvas.redo() === 0;
              undoButton.disabled = false;
            }

            document.addEventListener('DOMContentLoaded', function () {
              undoButton = document.querySelector('#undo');
              redoButton = document.querySelector('#redo');
              let rectE;
              let connection;
              let counter = 1;

              document.querySelector('#diagram').appendChild(canvas.getHTML());
              undoButton.addEventListener('click', undo, false);
              redoButton.addEventListener('click', redo, false);

              rectE = new DrawJS.Rectangle({
                id: "rectE",
                text: "Rect E",
                x: 514,
                y: 288
              });

              canvas.addShape(rectE);

              canvas.connect(triangleA, rectC);
              canvas.connect(rectB, 'ellipseA');
              canvas.connect('rectC', ellipseA);
              canvas.connect(ellipseA, rectD);
              canvas.connect('rectD', 'rectE');

              document.querySelector('#add').addEventListener('click', () => {
                const selection = document.querySelector('#shape-selector').value;
                const position = { x: 50, y: 50 };
                let shape;

                switch (selection) {
                  case 'Circle':
                    shape = new DrawJS.Circle({
                      text: `Circle #${counter}`,
                      position,
                    });
                    break;
                  case 'Rectangle':
                    shape = new DrawJS.Rectangle({
                      text: `Rectangle #${counter}`,
                      position,
                    });
                    break;
                  case 'Triangle':
                    shape = new DrawJS.Triangle({
                      text: `Triangle #${counter}`,
                      position,
                    });
                    break;
                  case 'Ellipse':
                    shape = new DrawJS.Ellipse({
                      text: `Ellipse #${counter}`,
                      position,
                    });
                    break;
                  default:
                }

                if (shape) {
                  canvas.executeCommand(DrawJS.COMMANDS.SHAPE_ADD, canvas, shape);
                  counter += 1;
                }
              }, false);

              // Here we add the undo/redo key binding.
              window.addEventListener('keydown', (event) => {
                switch (event.code) {
                  case 'KeyZ':
                    if (event.ctrlKey) {
                      if (event.shiftKey) {
                        redo();
                      } else {
                        undo();
                      }
                    }
                    break;
                }
              }, false);
            });
        </script>
    </head>
    <body>
      <div id="controls">
        <label>
          Select Shape:
          <select id="shape-selector">
            <option value="Circle">Circle</option>
            <option value="Rectangle">Rectangle</option>
            <option value="Triangle">Triangle</option>
            <option value="Ellipse">Ellipse</option>
          </select>
        </label>
        <button id="add">Add</button>
        <button id="undo" disabled>Undo</button>
        <button id="redo" disabled>Redo</button>
        <div>For start a connection start a drag from any shape while ALT key is pressed.</div>
      </div>
      <div id="diagram"></div>
    </body>
</html>
```
## Documentation
Documentation will be added in future updates.
## License
© Daniel Canedo Ramos

Licensed under the [MIT License](LICENSE).
