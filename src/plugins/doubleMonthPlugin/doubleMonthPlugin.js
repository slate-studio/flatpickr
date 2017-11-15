/* flatpickr v4.0.5, @license MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.doubleMonthPlugin = factory());
}(this, (function () { 'use strict';

  var __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };

  function doubleMonthPlugin(config) {
    if (config === void 0) {
      config = {};
    }

    return function (fp) {
      var secondInput;
      var fp2;
      var fp2Options;

      var createSecondInput = function () {
        secondInput = fp._input.cloneNode();
        secondInput.removeAttribute("id");
        fp._input.parentNode && fp._input.parentNode.appendChild(secondInput);

        fp2Options = __assign(fp2Options, fp2Callbacks);
        fp2 = new flatpickr(secondInput, fp2Options)
      };

      var fp1Callbacks = {
        onParseConfig: function () {
          fp.config.inline  = true;
          fp.config.mode    = 'single';
          fp.config.animate = false;

          fp2Options = {
            plugins:        [],
            inline:         true,
            dateFormat:     fp.config.dateFormat,
            nextArrow:      fp.config.nextArrow,
            prevArrow:      fp.config.prevArrow,
            ariaDateFormat: fp.config.ariaDateFormat,
            onDayShow:      fp.config.onDayShow,
            animate:        false
          };
        },
        onReady: function () {
          createSecondInput();
          fp._input.removeAttribute("readonly");
          secondInput.removeAttribute("readonly");
          fp.nextMonthNav.parentNode.removeChild(fp.nextMonthNav);
          fp2.prevMonthNav.parentNode.removeChild(fp2.prevMonthNav);

          fp.currentYearElement.setAttribute('readonly', 'readonly');
          fp2.currentYearElement.setAttribute('readonly', 'readonly');

          var fpYearParent  = fp.currentYearElement.parentNode;
          var fp2YearParent = fp2.currentYearElement.parentNode;

          fpYearParent.removeChild(fpYearParent.childNodes[2]);
          fpYearParent.removeChild(fpYearParent.childNodes[1]);
          fp2YearParent.removeChild(fp2YearParent.childNodes[2]);
          fp2YearParent.removeChild(fp2YearParent.childNodes[1]);
        },
        onChange: function (selectedDates, dateStr, instance) {
          var month = fp.currentMonth;
          var year  = fp.currentYear;
          var date  = new Date(year, month + 2, 1);

          var secondYear  = date.getFullYear();
          var secondMonth = date.getMonth();

          if(secondMonth < 10) {
            secondMonth = '0'+secondMonth;
          }
          var secondDate  = secondMonth + '-01-' + secondYear;
          fp2.setDate(secondDate, true, 'm-d-Y');
        },
        onMonthChange: function () {
          var skipEvent = fp.prevMonthNav.getAttribute('data-skip-event')
          if(skipEvent) {
            fp.prevMonthNav.removeAttribute('data-skip-event');
            return;
          }

          fp2.nextMonthNav.setAttribute('data-skip-event', 'true');
          fp2.changeMonth(-1, true, undefined, true);
        },
        onDayCreate: function (selectedDates, value, fpInstance, dayElement) {
          configDay(dayElement);
          fp.config.onDayShow(selectedDates, value, fpInstance, dayElement);
        }
      }

      var fp2Callbacks = {
        onChange: function (selectedDates, dateStr, instance) {
          fp.config.onDateSelect(selectedDates)
        },
        onMonthChange: function () {
          var skipEvent = fp2.nextMonthNav.getAttribute('data-skip-event');
          if(skipEvent) {
            fp2.nextMonthNav.removeAttribute('data-skip-event');
            return;
          }

          fp.prevMonthNav.setAttribute('data-skip-event', 'true');
          fp.changeMonth(1, true, undefined, true);
        },
        onDayCreate: function (selectedDates, value, fpInstance, dayElement) {
          configDay(dayElement);
          fp.config.onDayShow(selectedDates, value, fpInstance, dayElement);
        }
      }

      function configDay(dayElement) {
        var dateStr =  dayElement.getAttribute('aria-label');

        if(dateStr) {
          var date = new Date(dateStr);
          var dayWeekIndex = date.getDay();
          var dayInMonth   = date.getDate();

          if(dayWeekIndex == 0) {
            dayElement.className += ' start-week';
          }

          if(dayWeekIndex == 6) {
            dayElement.className += ' end-week';
          }

          if(dayInMonth == 1) {
            dayElement.className += ' start-month';
          }

          if(isLastMonthDay(date)) {
            dayElement.className += ' end-month';
          }
        }
      }

      function isLastMonthDay(date) {
        var test  = new Date(date.getTime());
        var month = test.getMonth();

        test.setDate(test.getDate() + 1);
        return test.getMonth() !== month;
      }

      return fp1Callbacks;
    }
  }

  return doubleMonthPlugin;
})));
