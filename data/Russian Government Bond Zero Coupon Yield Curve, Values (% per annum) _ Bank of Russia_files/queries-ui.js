var cbr = cbr || {};
cbr.modules = cbr.modules || {};
cbr.modules.queries = cbr.modules.queries || {};
cbr.modules.queries.uniDb = (function()
{
    var calculateDatePickerYearRange = function (minDate, maxDate) {
        if (!minDate && !maxDate)
            return undefined;

        var range = "";
        if (minDate) {
            range += $.datepicker.formatDate("yy", minDate);
        }
        else {
            range += "c-10"
        };
        range += ":";
        if (maxDate) {
            range += $.datepicker.formatDate("yy", maxDate);
        }
        else {
            range += "c+10"
        };
        return range;
    };

    return {
        showDateTimePickerForCalendarParam: function(dates, id, datepickerId) {
            var inputWithDate = $('#' + id);
            var currentdate = inputWithDate.val();
            var $datepickerSelector = $('#' + datepickerId);
            var minDate;
            var maxDate;
            $.each(dates, function (i, d) {
                if (!minDate || minDate > d) {
                    minDate = d;
                }
                if (!maxDate || maxDate < d) {
                    maxDate = d;
                }
            });
            var range;
            if (minDate && maxDate) {
                range = "" + $.datepicker.formatDate("yy", minDate) + ":" + $.datepicker.formatDate("yy", maxDate);
            }

            var dTimes = $.map(dates, function (e) { return e.getTime(); });
            $datepickerSelector.datepicker({
                changeMonth: true,
                changeYear: true,
                showButtonPanel: false,
                minDate: minDate,
                maxDate: maxDate,
                yearRange: calculateDatePickerYearRange(minDate, maxDate),
                beforeShowDay: function (date) {
                    if ($.inArray(date.getTime(), dTimes) != -1) {
                        return [true];
                    }
                    return [false];
                },
                onSelect: function (dateText, inst) {
                    inputWithDate.val(dateText).trigger('change');
                }
            });
            $datepickerSelector.datepicker("setDate", currentdate);
        },
        initCalendarDatePicker: function(id, minDate, maxDate) {
            var $selector = $('#' + id);

            $selector.datepicker({
                changeMonth: true,
                changeYear: true,
                minDate: minDate,
                maxDate: maxDate,
                yearRange: calculateDatePickerYearRange(minDate, maxDate)
            });
        }
    };
})();

cbr.modules.queries.createEditor = function (id, linesCount, mode, floating) {
    var mode = mode || 'ace/mode/sql';
    var linesCount = linesCount || 10;
    var editor = ace.edit(id);
    setTimeout(function () {
        editor.session.setMode(mode);
        editor.setTheme('ace/theme/github');
        editor.setOptions({

            autoScrollEditorIntoView: true,
            maxLines: linesCount,
            minLines: linesCount
        });
        if (floating) {
            editor.on("focus", function () {
                var linesCountOnFocus = linesCount * 2;
                editor.setOption("minLines", linesCountOnFocus);
                editor.setOption("maxLines", linesCountOnFocus);
            });
            editor.on("blur", function () {
                editor.setOption("minLines", linesCount);
                editor.setOption("maxLines", linesCount);
            });
        }
    }, 0);
    return editor;
};
cbr.modules.queries.getEditorValue = function (editor) {
    if (editor) {
        var value = editor.getSession().getValue();
        return value;
    }
};
cbr.modules.queries.addParentHrefToAnchorAsParameter = function (anchor) {
    try {
        var parentHref = parent.location.href;
        var documentHref = document.location.href;
        if (parentHref === documentHref)
        {
            return true;
        }
        var anchorHref = anchor.href.trim();
        //we can not use URL bject beacuse it does not support in IE
        var existParameters = (anchorHref.indexOf('?')!==-1)&&((anchorHref.indexOf('?') + 1) < anchorHref.length);
        if (existParameters) {
            anchorHref = anchorHref + '&';
        }
        else
        {
            if (anchorHref.indexOf('?') === -1)
            {
                anchorHref = anchorHref + '?';
            }
        }
        anchor.href = anchorHref + 'parentHref=' + encodeURIComponent(parentHref);
    }
    catch(e)
    {
        //blocked a frame with origin "frame href" from accessing a cross-origin frame.
    }
    return true;
}