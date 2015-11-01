import { Model } from 'backbone';
import { mixin } from 'backbone-validation';
import { extend } from 'underscore';

export const ValidatedModel = Model.extend();
extend( ValidatedModel.prototype, mixin );
