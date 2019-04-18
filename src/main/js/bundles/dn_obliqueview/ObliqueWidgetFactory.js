/*
 * Copyright (C) 2019 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import dom_class from "dojo/dom-class";
import dom_style from "dojo/dom-style";
import ObliqueWidget from "./ObliqueWidget";

class ObliqueWidgetFactory {

    activate() {
        let i18n = this._i18n.get();
        let properties = this._properties;
        this.animateRotation = properties.animateRotation;
        this.north = properties.north;
        this.east = properties.east;
        this.south = properties.south;
        this.west = properties.west;
        this.inObliqueMode = false;
        let widget = this.widget = new ObliqueWidget({
            source: this,
            i18n: i18n
        });
        widget.resize();
        let _this = this;
        this._mapModel.watch("view", () => {
            _this.watchRotationChange();
        });
    }

    createInstance() {
        return this.widget;
    }

    rotateRight() {
        let _view = this._mapModel.get("view");
        if (_view) {
            if (_view.rotation === 0 || _view.rotation < 90) {
                this.setViewRotation(_view.rotation, 90, "right");
            } else if (_view.rotation >= 90 && _view.rotation < 180) {
                this.setViewRotation(_view.rotation, 180, "right");
            } else if (_view.rotation >= 180 && _view.rotation < 270) {
                this.setViewRotation(_view.rotation, 270, "right");
            } else if (_view.rotation >= 270) {
                this.setViewRotation(_view.rotation, 0, "right");
            }
        }
    }

    rotateLeft() {
        let _view = this._mapModel.get("view");
        if (_view) {
            if (_view.rotation === 0 || _view.rotation > 270) {
                this.setViewRotation(_view.rotation, 270, "left");
            } else if (_view.rotation <= 270 && _view.rotation > 180) {
                this.setViewRotation(_view.rotation, 180, "left");
            } else if (_view.rotation <= 180 && _view.rotation > 90) {
                this.setViewRotation(_view.rotation, 90, "left");
            } else if (_view.rotation <= 90 && _view.rotation > 0) {
                this.setViewRotation(_view.rotation, 0, "left");
            }
        }
    }

    rotateToNearest() {
        let _view = this._mapModel.get("view");
        if (_view) {
            if (_view.rotation <= 270 && _view.rotation > 225) {
                this.setViewRotation(_view.rotation, 270, "right");
            } else if (_view.rotation <= 315 && _view.rotation > 270) {
                this.setViewRotation(_view.rotation, 270, "left");
            } else if (_view.rotation <= 180 && _view.rotation > 135) {
                this.setViewRotation(_view.rotation, 180, "right");
            } else if (_view.rotation <= 225 && _view.rotation > 180) {
                this.setViewRotation(_view.rotation, 180, "left");
            } else if (_view.rotation <= 90 && _view.rotation > 45) {
                this.setViewRotation(_view.rotation, 90, "right");
            } else if (_view.rotation <= 135 && _view.rotation > 90) {
                this.setViewRotation(_view.rotation, 90, "left");
            } else if (_view.rotation > 315) {
                this.setViewRotation(_view.rotation, 0, "right");
            } else if (_view.rotation <= 45) {
                this.setViewRotation(_view.rotation, 0, "left");
            }
        }
    }

    resetOrientation() {
        let _view = this._mapModel.get("view");
        if (_view) {
            _view.rotation = 0;
            if (this.inObliqueMode) {
                this.setOrientationVisible(_view);
            }
        }
    }

    setViewRotation(degreeFrom, degreeTo, direction) {
        degreeFrom = Math.round(degreeFrom);
        let rotationSpeed = 1;
        let _view = this._mapModel.get("view");
        if (_view) {
            if (!this.animateRotation) {
                _view.rotation = degreeTo;
                if (this.inObliqueMode) {
                    this.setOrientationVisible(_view);
                }
                return;
            }
            if (direction === "left") {
                if (degreeFrom === 0 && degreeTo !== 0)
                    degreeFrom = 360;
                if ((degreeFrom - degreeTo) < 7) {
                    _view.rotation = degreeTo;
                    if (this.inObliqueMode) {
                        this.setOrientationVisible(_view);
                    }
                    return;
                }
                let _this = this;
                setTimeout(function () {
                    degreeFrom = degreeFrom - 6;
                    _view.rotation = degreeFrom;
                    _this.setViewRotation(degreeFrom, degreeTo, direction);
                }, rotationSpeed);
            } else {
                if (degreeTo === 0 && degreeFrom !== 0)
                    degreeTo = 360;
                if ((degreeTo - degreeFrom) < 7) {
                    _view.rotation = degreeTo;
                    if (this.inObliqueMode) {
                        this.setOrientationVisible(_view);
                    }
                    return;
                }
                let _this = this;
                setTimeout(function () {
                    degreeFrom = degreeFrom + 6;
                    if (degreeFrom === 360) {
                        degreeFrom = 0;
                        degreeTo = 0;
                    }
                    ;
                    _view.rotation = degreeFrom;
                    _this.setViewRotation(degreeFrom, degreeTo, direction);
                }, rotationSpeed);
            }
        }
    }

    setOrientationVisible(_view) {
        let _map = _view.get("map");
        let orientation = this.north;
        if (_view.rotation === 0) {
            orientation = this.north;
        } else if (_view.rotation === 90) {
            orientation = this.west;
        } else if (_view.rotation === 180) {
            orientation = this.south;
        } else if (_view.rotation === 270) {
            orientation = this.east;
        }
        if (!_map.findLayerById(orientation).visible === true) {
            _map.findLayerById(this.north).visible = false;
            _map.findLayerById(this.south).visible = false;
            _map.findLayerById(this.east).visible = false;
            _map.findLayerById(this.west).visible = false;
            _map.findLayerById(orientation).visible = true;
        }
    }

    setSpecificOrientationVisible(_map, orientation) {
        if (!_map.findLayerById(orientation).visible === true) {
            _map.findLayerById(this.north).visible = false;
            _map.findLayerById(this.south).visible = false;
            _map.findLayerById(this.east).visible = false;
            _map.findLayerById(this.west).visible = false;
            _map.findLayerById(orientation).visible = true;
        }
    }

    setCompassDirection(degree) {
        dom_style.set(this.widget._compassNode, "-webkit-transform", "rotate(" + degree + "deg)");
        dom_style.set(this.widget._compassNode, "-moz-transform", "rotate(" + degree + "deg)");
        dom_style.set(this.widget._compassNode, "-o-transform", "rotate(" + degree + "deg)");
        dom_style.set(this.widget._compassNode, "-ms-transform", "rotate(" + degree + "deg)");
        dom_style.set(this.widget._compassNode, "transform", "rotate(" + degree + "deg)");
    }

    toggleObliqueView() {
        let i18n = this._i18n.get();
        let _view = this._mapModel.get("view");
        if (_view) {
            this.inObliqueMode = !this.inObliqueMode;
            let _map = _view.get("map");
            if (this.inObliqueMode) {
                this.rotateToNearest();
                this.widget._stopObliqueNode.title = i18n.stopObliqueTooltip;
                dom_class.remove(this.widget._stopObliqueNode, "icons-oblique-aerial-oblique");
                dom_class.add(this.widget._stopObliqueNode, "icons-oblique-aerial-straight");
            } else {
                this.widget._stopObliqueNode.title = i18n.startObliqueTooltip;
                _map.findLayerById(this.north).visible = false;
                _map.findLayerById(this.south).visible = false;
                _map.findLayerById(this.east).visible = false;
                _map.findLayerById(this.west).visible = false;
                dom_class.remove(this.widget._stopObliqueNode, "icons-oblique-aerial-straight");
                dom_class.add(this.widget._stopObliqueNode, "icons-oblique-aerial-oblique");
            }
        }
    }

    watchRotationChange() {
        let _view = this._mapModel.get("view");
        let _map = _view.get("map");

        // for demo purposes as long as snapToZoom can't be set in app.json
        _view.constraints.snapToZoom = false;

        let _this = this;
        _view.watch("rotation", function (rotation) {
            let degree = Math.round(rotation);
            _this.setCompassDirection(degree);
            if (_this.inObliqueMode) {
                if (_view.rotation <= 315 && _view.rotation > 225) {
                    _this.setSpecificOrientationVisible(_map, _this.east);
                } else if (_view.rotation <= 225 && _view.rotation > 135) {
                    _this.setSpecificOrientationVisible(_map, _this.south);
                } else if (_view.rotation <= 135 && _view.rotation > 45) {
                    _this.setSpecificOrientationVisible(_map, _this.west);
                } else if (_view.rotation > 315 || _view.rotation <= 45) {
                    _this.setSpecificOrientationVisible(_map, _this.north);
                }
            }
        });
    }
}

module.exports = ObliqueWidgetFactory;