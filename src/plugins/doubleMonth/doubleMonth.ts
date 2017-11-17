import { Instance } from "types/instance";

declare global {
  interface Window {
    doubleMonth: () => void;
  }
}

interface Config {
  plugins?:        any,
  inline?:         boolean,
  dateFormat?:     string,
  nextArrow?:      string,
  prevArrow?:      string,
  ariaDateFormat?: string,
  onDayShow?:      any,
  onDaySelect?:    any,
  animate?:        boolean,
  onChange?:       any,
  onMonthChange?:  any,
  onDayCreate?:    any,
  disableScrollNavigation?: boolean,
}

function doubleMonth() {
  return function(fp: Instance) {
    let secondInput: HTMLInputElement,
      fp2: flatpickr;

    const createSecondInput = () => {
      secondInput = fp._input.cloneNode() as HTMLInputElement;
      secondInput.removeAttribute("id");
      fp._input.parentNode && fp._input.parentNode.appendChild(secondInput);


      var fp2Options: Config = {
        plugins:        [],
        inline:         true,
        dateFormat:     fp.config.dateFormat,
        nextArrow:      fp.config.nextArrow,
        prevArrow:      fp.config.prevArrow,
        ariaDateFormat: fp.config.ariaDateFormat,
        onDayShow:      fp.config.onDayShow,
        animate:        false,
        disableScrollNavigation: true,
      };

      fp2Options = { ...fp2Options, ...fp2Callbacks };
      fp2 = new flatpickr(secondInput, fp2Options)
    };

    const fp1Callbacks = {
      onParseConfig() {
        fp.config.inline  = true;
        fp.config.mode    = 'single';
        fp.config.animate = false;
        fp.config.disableScrollNavigation = true;
      },

      onReady() {
        createSecondInput();
        fp._input.removeAttribute("readonly");
        secondInput.removeAttribute("readonly");

        if (fp.nextMonthNav && fp.nextMonthNav.parentNode)
          fp.nextMonthNav.parentNode.removeChild(fp.nextMonthNav);

        if (fp2.prevMonthNav && fp2.prevMonthNav.parentNode)
          fp2.prevMonthNav.parentNode.removeChild(fp2.prevMonthNav);

        fp.currentYearElement.setAttribute('readonly', 'readonly');
        fp2.currentYearElement.setAttribute('readonly', 'readonly');

        var fpYearParent  = fp.currentYearElement.parentNode;
        var fp2YearParent = fp2.currentYearElement.parentNode;

        if (fpYearParent) {
          fpYearParent.removeChild(fpYearParent.childNodes[2]);
          fpYearParent.removeChild(fpYearParent.childNodes[1]);
        }

        if (fp2YearParent) {
          fp2YearParent.removeChild(fp2YearParent.childNodes[2]);
          fp2YearParent.removeChild(fp2YearParent.childNodes[1]);
        }
      },

      onChange () {
        var month = fp.currentMonth;
        var year  = fp.currentYear;
        var date  = new Date(year, month + 2, 1);

        var secondYear  = date.getFullYear();
        var secondMonth = date.getMonth();
        var secondMonthStr = String(secondMonth);

        if(secondMonth < 10) {
          secondMonthStr = '0'+secondMonth;
        }
        var secondDate  = secondMonthStr + '-01-' + secondYear;
        fp2.setDate(secondDate, false, 'm-d-Y');
        fp.config.onDateSelect(fp.input.value);
      },

      onMonthChange () {
        var skipEvent = fp.prevMonthNav.getAttribute('data-skip-event')
        if(skipEvent) {
          fp.prevMonthNav.removeAttribute('data-skip-event');
          return;
        }

        fp2.nextMonthNav.setAttribute('data-skip-event', 'true');
        fp2.changeMonth(-1, true, undefined, true);
      },

      onDayCreate (selectedDates: Date[], value: string, fpInstance: Instance, dayElement: any) {
        configDay(dayElement);
        fp.config.onDayShow(selectedDates, value, fpInstance, dayElement);
      },
    };

    const fp2Callbacks: Config = {
      onChange () {
        fp.config.onDateSelect(fp2.input.value);
      },

      onMonthChange() {
        var skipEvent = fp2.nextMonthNav.getAttribute('data-skip-event');
        if(skipEvent) {
          fp2.nextMonthNav.removeAttribute('data-skip-event');
          return;
        }

        fp.prevMonthNav.setAttribute('data-skip-event', 'true');
        fp.changeMonth(1, true, undefined, true);
      },

      onDayCreate (selectedDates: Date[], value: string, fpInstance: Instance, dayElement: any) {
        configDay(dayElement);
        fp.config.onDayShow(selectedDates, value, fpInstance, dayElement);
      },
    };

    function configDay(dayElement: HTMLInputElement) {
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

    function isLastMonthDay(date: Date) {
      var test  = new Date(date.getTime());
      var month = test.getMonth();

      test.setDate(test.getDate() + 1);
      return test.getMonth() !== month;
    }

    return fp1Callbacks;
  };
}

export default doubleMonth;
