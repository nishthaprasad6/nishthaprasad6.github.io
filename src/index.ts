import * as Two from 'two.js';
import * as _ from 'lodash';
import * as $ from 'jquery';

import './style.scss';

function generateCanvas() {
  const type = 'svg';
  let two = new Two({
    type: Two.Types[type],
    fullscreen: true,
    autostart: true
  }).appendTo(document.querySelector('div.interactive'));

  Two.Resoultion = 32;

  const delta = new Two.Vector();
  const mouse = new Two.Vector();
  const drag = 0.25;
  const radius = 30;

  let shadow = two.makeCircle(two.width / 2, two.height / 2, radius);
  shadow.noStroke().fill = 'rgba(0, 0, 0, 0.1)';
  shadow.offset = new Two.Vector(-radius / 2, radius * 2);
  shadow.scale = 0.85;

  let ball = two.makeCircle(two.width / 2, two.height / 2, radius);
  ball.noStroke().fill = 'white';

  _.each(ball.vertices, function(v) {
    v.origin = new Two.Vector().copy(v);
  });

  const $window = $(window)
    .bind('mousemove', function(e) {
      mouse.x = Math.abs(window.innerWidth - e.clientX);
      mouse.y = Math.abs(window.innerHeight - e.clientY);
      shadow.offset.x = 5 * radius * (mouse.x - two.width / 2) / two.width;
      shadow.offset.y = 5 * radius * (mouse.y - two.height / 2) / two.height;
    })
    .bind('touchstart', function(e) {
      e.preventDefault();
      return false;
    })
    .bind('touchmove', function(e) {
      e.preventDefault();
      const touch = e.originalEvent.changedTouches[0];
      mouse.x = Math.abs(window.innerWidth - touch.pageX);
      mouse.y = Math.abs(window.innerHeight - touch.pageY);
      shadow.offset.x = 5 * radius * (mouse.x - two.width / 2) / two.width;
      shadow.offset.y = 5 * radius * (mouse.y - two.height / 2) / two.height;
      return false;
    });

  two.bind('update', function() {
    delta.copy(mouse).subSelf(ball.translation);

    _.each(ball.vertices, function(v, i) {
      const dist = v.origin.distanceTo(delta);
      const pct = dist / radius;

      const x = delta.x * pct;
      const y = delta.y * pct;

      const destx = v.origin.x - x;
      const desty = v.origin.y - y;

      v.x += (destx - v.x) * drag;
      v.y += (desty - v.y) * drag;

      shadow.vertices[i].copy(v);
    });

    ball.translation.addSelf(delta);

    shadow.translation.copy(ball.translation);
    shadow.translation.addSelf(shadow.offset);
  });
}

document.addEventListener('DOMContentLoaded', generateCanvas);
