import ComponentUI from '../component/ComponentUI';
import { EVENT as SHAPE_EVENT } from './Shape';

class ShapeUI extends ComponentUI {
  constructor(...args) {
    super(...args);

    this._handleTargetMove = this._handleTargetMove.bind(this);
  }

  _updatePosition({ x, y }) {
    if (this._html) {
      this._html.setAttribute('transform', `translate(${x}, ${y})`);
    }
  }

  _handleTargetMove(event, position) {
    this._updatePosition(position);
  }

  _createHTML() {
    super._createHTML();

    const { _html, _target, _handleTargetMove } = this;

    _html.classList.add('shape-ui');
    _target.getCanvas()._dom.uiLayer.append(this._html);
    this._updatePosition(_target.getPosition());
    _target.getCanvas().addEventListener(SHAPE_EVENT.POSITION_CHANGE, _target, _handleTargetMove);
    _target.getCanvas().addEventListener(SHAPE_EVENT.DRAG, _target, _handleTargetMove);

    return this;
  }

  remove() {
    const { _target, _handleTargetMove } = this;

    _target.getCanvas().removeEventListener(SHAPE_EVENT.POSITION_CHANGE, _target, _handleTargetMove);
    _target.getCanvas().removeEventListener(SHAPE_EVENT.DRAG, _target, _handleTargetMove);
    super.remove();
  }
}

export default ShapeUI;