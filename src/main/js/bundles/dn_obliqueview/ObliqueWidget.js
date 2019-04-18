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
import declare from "dojo/_base/declare";
import _Widget from "dijit/_WidgetBase";
import _TemplatedMixin from "dijit/_TemplatedMixin";
import _WidgetsInTemplateMixin from "dijit/_WidgetsInTemplateMixin";
import templateStringContent from "dojo/text!./templates/ObliqueWidget.html";

import "dijit/layout/BorderContainer";
import "dijit/layout/ContentPane";
import "dijit/form/Button";

const ObliqueWidget = declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
    templateString: templateStringContent,
    baseClass: "obliqueWidget",

    postCreate: function () {
        let i18n = this.i18n;
        this._compassNode.title = i18n.compassTooltip;
        this._rightArrowNode.title = i18n.rightArrowTooltip;
        this._leftArrowNode.title = i18n.leftArrowTooltip;
        this._stopObliqueNode.title = i18n.startObliqueTooltip;
    },

    resize: function (dims) {
        this._container.resize(dims);
    },

    _rotateRight: function () {
        this.source.rotateRight();
    },

    _rotateLeft: function () {
        this.source.rotateLeft();
    },

    _resetOrientation: function () {
        this.source.resetOrientation();
    },

    _toggleObliqueView: function () {
        this.source.toggleObliqueView();
    }
});
module.exports = ObliqueWidget;